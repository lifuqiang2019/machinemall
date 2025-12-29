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

const Hero = ({ slides }: { slides?: any[] }) => {
    const activeSlides = slides && slides.length > 0 ? slides : BANNERS;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, [activeSlides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    }, [activeSlides.length]);

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
                                <ChevronRight size={16} className={`flex-shrink-0 transition-all ${hoveredCategory === cat.id ? 'text-primary translate-x-1' : 'text-gray-400'} group-hover:text-primary group-hover:translate-x-1`} />
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
                <div className="flex-1 relative h-[450px] overflow-hidden group">
                    {activeSlides.map((banner, index) => (
                        <div
                            key={banner.id || index}
                            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                        >
                            <img
                                src={banner.bg || banner.image}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-0 left-0 w-full h-full bg-black/20" />
                            <div className="absolute top-1/2 left-16 transform -translate-y-1/2 text-white z-20 max-w-[500px]">
                                <h2 className="text-[42px] font-bold leading-tight mb-4 animate-fade-in-up">
                                    {banner.title.split('\n').map((line: string, i: number) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </h2>
                                <p className="text-lg mb-8 text-gray-100 animate-fade-in-up delay-100">
                                    {banner.text}
                                </p>
                                <button className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded text-sm font-semibold transition-all animate-fade-in-up delay-200 flex items-center gap-2">
                                    Explore Now <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Controls */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white z-20 opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white z-20 opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {activeSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    index === currentSlide ? "w-8 bg-primary" : "bg-white/50 hover:bg-white"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
