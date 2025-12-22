"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CATEGORIES } from "@/lib/mockData";
import { ChevronRight, ChevronLeft } from "lucide-react";

const BANNERS = [
    {
        id: 1,
        title: "Global Industry &\nEquipment Marketplace",
        text: "Find the best machinery from top manufacturers.",
        bg: "https://placehold.co/1200x600/0154A6/white"
    },
    {
        id: 2,
        title: "Construction &\nEngineering Solutions",
        text: "Reliable equipment for every project size.",
        bg: "https://placehold.co/1200x600/004080/white"
    },
    {
        id: 3,
        title: "Agriculture &\nLogistics Equipment",
        text: "Efficiency focused machinery for your business.",
        bg: "https://placehold.co/1200x600/003366/white"
    }
];

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <section className="bg-white pb-6">
            <div className="max-w-container mx-auto px-10 flex gap-0">
                {/* Category Sidebar */}
                <div
                    className="w-[240px] bg-white h-[450px] relative z-20 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                    onMouseLeave={() => setHoveredCategory(null)}
                >
                    <ul className="list-none">
                        {CATEGORIES.map((cat, index) => (
                            <li
                                key={index}
                                className="px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all group border-b border-gray-50 last:border-0"
                                onMouseEnter={() => setHoveredCategory(cat.id)}
                            >
                                <span className={`text-[14px] font-medium transition-colors ${hoveredCategory === cat.id ? 'text-primary' : 'text-text-main'} group-hover:text-primary`}>
                                    {cat.name}
                                </span>
                                <ChevronRight size={16} className={`transition-all ${hoveredCategory === cat.id ? 'text-primary translate-x-1' : 'text-gray-400'} group-hover:text-primary group-hover:translate-x-1`} />
                            </li>
                        ))}
                    </ul>

                    {/* Hover Submenu Panel */}
                    {hoveredCategory && (
                        <div className="absolute top-0 left-full w-[850px] h-full bg-white shadow-[10px_0_30px_rgba(0,0,0,0.05)] border-l border-gray-100 p-8 z-[30] overflow-y-auto custom-scrollbar">
                            <div className="flex flex-col gap-8">
                                {CATEGORIES.find(c => c.id === hoveredCategory)?.sections?.map((section, sIdx) => (
                                    <div key={sIdx}>
                                        <h3 className="text-[14px] font-bold text-text-main mb-4 border-b border-gray-50 pb-2">
                                            {section.title}
                                        </h3>
                                        <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                                            {section.items.map((item, iIdx) => (
                                                <a
                                                    key={iIdx}
                                                    href="#"
                                                    className="text-[13px] text-gray-500 hover:text-primary transition-colors leading-relaxed block"
                                                >
                                                    {item}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {(!CATEGORIES.find(c => c.id === hoveredCategory)?.sections || CATEGORIES.find(c => c.id === hoveredCategory)?.sections?.length === 0) && (
                                    <div className="py-10 text-center text-gray-400 text-sm">
                                        Subcategories coming soon.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Carousel Banner */}
                <div className="flex-1 h-[450px] relative overflow-hidden group">
                    <div className="absolute inset-0 z-0">
                        {BANNERS.map((banner, index) => (
                            <div
                                key={banner.id}
                                className={`absolute inset-0 flex items-center px-[50px] bg-cover bg-center transition-opacity duration-700 ease-in-out ${index === currentSlide ? "opacity-100 z-[2]" : "opacity-0 z-[1]"}`}
                                style={{ backgroundImage: `url('${banner.bg}')` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.5)] to-transparent z-0"></div>
                                <div className="relative z-[3]">
                                    <h1 className="text-white text-[42px] leading-[1.2] mb-5 font-bold hero-banner-heading">
                                        {banner.title.split('\n').map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </h1>
                                    <p className="text-white text-[18px] opacity-90 mb-8">{banner.text}</p>
                                    <button className="bg-primary text-white py-[12px] px-[35px] border-none rounded-[5px] font-semibold cursor-pointer transition-all hover:bg-primary-hover active:scale-95">
                                        Explore Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Carousel Controls */}
                    <button className="absolute top-1/2 -translate-y-1/2 left-5 bg-black/30 text-white border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer z-10 hover:bg-black/60" onClick={prevSlide}>
                        <ChevronLeft size={24} />
                    </button>
                    <button className="absolute top-1/2 -translate-y-1/2 right-5 bg-black/30 text-white border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer z-10 hover:bg-black/60" onClick={nextSlide}>
                        <ChevronRight size={24} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-[10px] z-10">
                        {BANNERS.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2.5 h-2.5 rounded-full border-none cursor-pointer transition-all ${index === currentSlide ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"}`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
