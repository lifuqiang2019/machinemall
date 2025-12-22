import React from "react";
import { CATEGORY_BAR_ITEMS } from "@/lib/mockData";

const CategoryBar = () => {
    return (
        <div className="bg-white py-6 border-b border-gray-100">
            <div className="max-w-container mx-auto px-10 flex justify-around items-start">
                {CATEGORY_BAR_ITEMS.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-[15px] cursor-pointer transition-transform hover:-translate-y-[3px] w-[120px] text-center group">
                        <div className="w-[70px] h-[70px] flex items-center justify-center">
                            <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <span className="text-[14px] text-text-main group-hover:text-primary transition-colors">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryBar;
