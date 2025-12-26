"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll to top smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    return (
        <div className={`fixed bottom-8 right-8 z-50 transition-all duration-300 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
            }`}>
            <button
                onClick={scrollToTop}
                className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:scale-110 active:scale-95"
                aria-label="Back to top"
            >
                <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                <ArrowUp size={24} className="relative z-10 transition-transform group-hover:-translate-y-1" />
            </button>
        </div>
    );
};

export default BackToTop;
