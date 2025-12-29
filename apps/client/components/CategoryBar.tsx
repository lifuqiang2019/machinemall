import React from "react";
// import { CATEGORY_BAR_ITEMS } from "@/lib/mockData";

interface Category {
    id: number;
    name: string;
    image?: string;
}

interface CategoryBarProps {
    categories?: Category[];
}

const CategoryBar = ({ categories = [] }: CategoryBarProps) => {
    if (!categories || categories.length === 0) return null;

    return (
        <div className="bg-white py-6 border-b border-gray-100">
            <div className="max-w-container mx-auto px-10 flex justify-between items-start gap-[20px] flex-wrap">
                {categories.map((item) => (
                    <div key={item.id} className="flex flex-col items-center gap-[5px] cursor-pointer transition-transform hover:-translate-y-[3px] flex-1 min-w-[120px] max-w-[150px] text-center group">
                        <div className="w-full aspect-square flex items-center justify-center">
                            <img 
                                src={item.image || 'https://via.placeholder.com/150'} 
                                alt={item.name} 
                                className="max-w-full max-h-full object-contain" 
                            />
                        </div>
                        <span className="text-[14px] text-text-main group-hover:text-primary transition-colors mt-2">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryBar;
