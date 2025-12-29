import React, { useState, useEffect } from 'react';
import { Button, Input, Upload, Card, Space, Row, Col, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Slide {
  image: string;
  title: string;
  text: string;
  uid?: string; // Internal ID for drag and drop
}

interface HeroSlidesEditorProps {
  value?: Slide[];
  onChange?: (value: Slide[]) => void;
}

const SortableSlideItem = ({ 
  slide, 
  index, 
  onRemove, 
  onUpdate 
}: { 
  slide: Slide; 
  index: number; 
  onRemove: (uid: string) => void; 
  onUpdate: (uid: string, field: keyof Slide, val: string) => void; 
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.uid! });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: 16,
    opacity: isDragging ? 0.5 : 1,
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  // Use state for fileList to ensure updates during interaction
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Sync fileList with slide.image prop
  useEffect(() => {
      if (slide.image) {
          setFileList([{
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: slide.image,
          }]);
      } else {
          setFileList([]);
      }
  }, [slide.image]);

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
        onUpdate(slide.uid!, 'image', data.url);
      } else {
        onError(new Error('Upload failed'));
      }
    } catch (err) {
      onError(err);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
      // Update local state to show progress/preview immediately
      setFileList(newFileList);
      
      // If removed
      if (newFileList.length === 0) {
          onUpdate(slide.uid!, 'image', '');
      }
  };

  return (
    <div ref={setNodeRef} style={style}>
        <Card 
            size="small" 
            title={
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'move' }} {...attributes} {...listeners}>
                    <HolderOutlined style={{ marginRight: 8, color: '#999' }} />
                    <span>轮播图 #{index + 1}</span>
                </div>
            }
            extra={<Button type="text" danger icon={<DeleteOutlined />} onClick={() => onRemove(slide.uid!)} />}
        >
            <Row gutter={16} align="middle">
                <Col flex="120px">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        customRequest={customRequest}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        maxCount={1}
                        showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
                    >
                        {fileList.length < 1 && (
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>上传</div>
                            </div>
                        )}
                    </Upload>
                </Col>
                <Col flex="auto">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Input 
                            placeholder="标题" 
                            value={slide.title} 
                            onChange={(e) => onUpdate(slide.uid!, 'title', e.target.value)}
                            addonBefore="标题"
                        />
                        <Input 
                            placeholder="描述文本" 
                            value={slide.text} 
                            onChange={(e) => onUpdate(slide.uid!, 'text', e.target.value)} 
                            addonBefore="描述"
                        />
                    </Space>
                </Col>
            </Row>
        </Card>
        
        <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
            <img alt="preview" style={{ width: '100%' }} src={slide.image} />
        </Modal>
    </div>
  );
};

const HeroSlidesEditor: React.FC<HeroSlidesEditorProps> = ({ value = [], onChange }) => {
  // We need internal state to handle UIDs for drag and drop
  const [items, setItems] = useState<Slide[]>([]);

  // Sync from props to state
  useEffect(() => {
      // If value changes externally (e.g. form reset), update items
      // We map value to items, preserving UIDs if they match, or generating new ones
      // To avoid regenerating UIDs on every render/change that comes from internal, we need a way to detect source.
      // But typically for this use case, we can just check if items match value roughly.
      
      const newItems = (value || []).map((v, i) => {
          // If we have an existing item at this index with same data, keep its UID
          // This is a bit tricky. Simplest is to just re-generate UIDs if length differs or assume sync.
          // Let's attach UIDs if missing.
          return {
              ...v,
              uid: (v as any).uid || Math.random().toString(36).substr(2, 9)
          };
      });
      
      // Simple deep compare to avoid infinite loop if onChange triggers parent re-render which triggers this useEffect
      if (JSON.stringify(newItems.map(i => ({...i, uid: ''}))) !== JSON.stringify(items.map(i => ({...i, uid: ''})))) {
          setItems(newItems);
      }
  }, [value]);

  const triggerChange = (newItems: Slide[]) => {
      setItems(newItems);
      // Strip UIDs before sending to parent
      const cleanValue = newItems.map(({ uid, ...rest }) => rest);
      onChange?.(cleanValue);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.uid === active.id);
      const newIndex = items.findIndex((i) => i.uid === over?.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      triggerChange(newItems);
    }
  };

  const handleAdd = () => {
      const newSlide: Slide = {
          image: '',
          title: '',
          text: '',
          uid: Math.random().toString(36).substr(2, 9)
      };
      triggerChange([...items, newSlide]);
  };

  const handleRemove = (uid: string) => {
      triggerChange(items.filter(i => i.uid !== uid));
  };

  const handleUpdate = (uid: string, field: keyof Slide, val: string) => {
      const newItems = items.map(item => {
          if (item.uid === uid) {
              return { ...item, [field]: val };
          }
          return item;
      });
      triggerChange(newItems);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.uid!)} strategy={verticalListSortingStrategy}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map((slide, index) => (
                <SortableSlideItem 
                    key={slide.uid} 
                    slide={slide} 
                    index={index} 
                    onRemove={handleRemove}
                    onUpdate={handleUpdate}
                />
            ))}
        </div>
      </SortableContext>
      <Button type="dashed" onClick={handleAdd} block icon={<PlusOutlined />} style={{ marginTop: 8 }}>
        添加轮播图
      </Button>
    </DndContext>
  );
};

export default HeroSlidesEditor;
