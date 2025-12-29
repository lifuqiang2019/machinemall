import React, { useState, useEffect } from 'react';
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ImageUploadProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  maxCount?: number;
  mainImage?: string;
  onMainImageChange?: (url: string) => void;
}

interface DraggableUploadListItemProps {
  originNode: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  file: UploadFile<any>;
}

const DraggableUploadListItem = ({ originNode, file }: DraggableUploadListItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: file.uid,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'move',
    opacity: isDragging ? 0.5 : 1,
  };

  // Prevent drag when clicking delete/preview buttons
  // The originNode is the Antd Upload list item
  // We need to clone it to attach refs? No, Antd's itemRender wraps the item.
  // Actually, we should wrap the originNode.

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? 'is-dragging' : ''}
    >
      {/* 
          Antd's originNode contains the preview image and actions.
          We need to ensure listeners don't block clicks on buttons.
          However, dnd-kit handles this usually if we use PointerSensor.
       */}
      {originNode}
    </div>
  );
};

const ImageUpload: React.FC<ImageUploadProps> = ({ value = [], onChange, maxCount = 5, mainImage, onMainImageChange }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // Sync fileList with value prop when value changes (e.g. from DB)
  useEffect(() => {
    // Only update if value is different from current fileList to avoid loops
    // Simplified check: compare lengths or just checking if fileList is empty and value is not
    const currentUrls = fileList.map(f => f.url).filter(Boolean);
    const valueUrls = value || [];
    
    // Check if arrays are different
    const isDifferent = currentUrls.length !== valueUrls.length || !currentUrls.every((val, index) => val === valueUrls[index]);

    if (isDifferent) {
        setFileList(
            valueUrls.map((url, index) => ({
                uid: url, // Use URL as UID for stability if unique, or fallback
                name: `image-${index}`,
                status: 'done',
                url: url,
            }))
        );
    }
  }, [value]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setFileList((prev) => {
        const activeIndex = prev.findIndex((i) => i.uid === active.id);
        const overIndex = prev.findIndex((i) => i.uid === over?.id);
        const newFileList = arrayMove(prev, activeIndex, overIndex);
        
        // Trigger onChange with new order
        const newUrls = newFileList.map(f => f.url!).filter(Boolean);
        onChange?.(newUrls);
        
        return newFileList;
      });
    }
  };

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // We only update state here. 
    // BUT we must be careful: if we are dragging, handleChange might not be called.
    // handleChange is called when adding/removing/uploading.
    setFileList(newFileList);
    
    // Process URLs
    const allUrls = newFileList
      .map(file => {
          if (file.status === 'done') {
              return file.response?.url || file.url;
          }
          return null;
      })
      .filter(Boolean) as string[];

    // Only call onChange if the list effectively changed (completed uploads or removals)
    // Avoid calling it for 'uploading' status to prevent jitter
    if (newFileList.every(f => f.status === 'done' || f.status === 'error' || f.status === 'removed')) {
        onChange?.(allUrls);
    }
  };

  const customRequest = async (options: any) => {
    const { onSuccess, onError, file } = options;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.url) {
        onSuccess(data);
      } else {
        onError(new Error('Upload failed'));
      }
    } catch (err) {
      onError(err);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <SortableContext items={fileList.map((i) => i.uid)} strategy={horizontalListSortingStrategy}>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            customRequest={customRequest}
            maxCount={maxCount}
            itemRender={(originNode, file) => (
              <DraggableUploadListItem originNode={originNode} file={file} />
            )}
          >
            {fileList.length >= maxCount ? null : uploadButton}
          </Upload>
        </SortableContext>
      </DndContext>
      <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ImageUpload;
