"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PRODUCT_DETAILS, FEATURED_PRODUCTS } from "@/lib/mockData";
import ProductSection from "@/components/ProductSection";
import {
    ChevronRight,
    Star,
    MessageSquare,
    Mail,
    ShieldCheck,
    Globe,
    CheckCircle2,
    Package,
    Truck,
    Clock,
    ShoppingCart,
    Search
} from "lucide-react";

export default function ProductDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const product = PRODUCT_DETAILS[id] || PRODUCT_DETAILS["5678"]; // Fallback to example for demo
    const [activeTab, setActiveTab] = useState("overview");
    const [mainImage, setMainImage] = useState(product.image);

    // Zoom state
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [showZoom, setShowZoom] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    if (!product) return <div>Product not found</div>;

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPos({ x, y });
    };

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "specifications", label: "Specifications" },
        { id: "shipping", label: "Shipping" }
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-container mx-auto px-10 py-4 flex items-center gap-2 text-[13px] text-gray-500">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link href="#" className="hover:text-primary transition-colors">{product.category}</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 font-medium truncate max-w-[400px]">{product.name}</span>
                </div>
            </div>

            <div className="max-w-container mx-auto px-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6">

                    {/* Left: Image Gallery */}
                    <div className="lg:col-span-5 space-y-4">
                        <div
                            ref={containerRef}
                            className="bg-white rounded-lg border border-gray-100 relative aspect-square cursor-crosshair group/zoom"
                            onMouseEnter={() => setShowZoom(true)}
                            onMouseLeave={() => setShowZoom(false)}
                            onMouseMove={handleMouseMove}
                        >
                            {/* Inner wrapper with overflow-hidden for the lens area */}
                            <div className="absolute inset-0 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                                <Image
                                    src={mainImage}
                                    alt={product.name}
                                    fill
                                    className="object-contain select-none"
                                    unoptimized={true}
                                />

                                {showZoom && (
                                    <div
                                        className="absolute w-44 h-44 bg-primary/10 border border-primary/30 pointer-events-none hidden lg:block z-10 shadow-[0_0_0_9999px_rgba(255,255,255,0.3)]"
                                        style={{
                                            left: `${zoomPos.x}%`,
                                            top: `${zoomPos.y}%`,
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    />
                                )}
                            </div>

                            {/* Zoom Preview Panel - PLACED OUTSIDE overflow-hidden wrapper */}
                            {showZoom && (
                                <div
                                    className="absolute top-0 left-[calc(100%+30px)] w-[600px] h-[600px] bg-white border border-gray-200 shadow-2xl z-50 rounded-lg overflow-hidden hidden lg:block"
                                    style={{
                                        backgroundImage: `url(${mainImage})`,
                                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                        backgroundSize: '300%',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                />
                            )}

                            {/* Mobile/Default Zoom hint */}
                            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-2.5 rounded-lg text-primary border border-primary/10 shadow-sm lg:opacity-0 lg:group-hover/zoom:opacity-100 transition-opacity z-20 pointer-events-none">
                                <Search size={20} strokeWidth={3} />
                            </div>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                            {product.images?.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`relative w-24 h-24 rounded-xl border-2 flex-shrink-0 transition-all ${mainImage === img ? 'border-primary shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover p-2 rounded-xl" unoptimized={true} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Basic Info */}
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[12px] font-bold rounded-full mb-4 uppercase tracking-wider">
                                {product.status} Arrival
                            </span>
                            <h1 className="text-3xl font-extrabold text-text-main leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-6 mt-4">
                                <div className="flex items-center gap-1 text-secondary">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                    <span className="text-gray-400 text-sm ml-2">(4.9/5)</span>
                                </div>
                                <div className="text-gray-400 text-sm border-l pl-6 border-gray-200">
                                    <span className="font-bold text-text-main">500+</span> Orders
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                            <div className="pb-6">
                                <div className="flex items-baseline gap-3 mb-6">
                                    <span className="text-4xl font-black text-primary">$4,850.00 - $5,200.00</span>
                                    <span className="text-gray-400 text-sm font-medium">/ Set (FOB Price)</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {product.summary?.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                            <CheckCircle2 size={18} className="text-primary shrink-0" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 space-y-6">
                                <div className="flex flex-wrap gap-4">
                                    <button className="flex-1 min-w-[200px] bg-primary text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                                        <Mail size={22} />
                                        Inquiry Now
                                    </button>
                                    <button className="flex-1 min-w-[200px] bg-secondary text-primary py-4 px-8 rounded-lg font-bold text-lg hover:bg-secondary-hover shadow-xl shadow-secondary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                                        <MessageSquare size={22} />
                                        Chat Online
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                            <ShieldCheck size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-text-main">Trade Assurance</p>
                                            <p className="text-[11px] text-gray-400">Protects your on-time shipping</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                            <Globe size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-text-main">Worldwide Delivery</p>
                                            <p className="text-[11px] text-gray-400">Door-to-door logistics</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Supplier Info Snippet */}
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl text-white flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md">
                                    <span className="text-xl font-bold text-secondary">X</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">XCMG Global Trading Co., Ltd.</h3>
                                    <p className="text-white/60 text-[12px] flex items-center gap-2 mt-0.5">
                                        <Globe size={12} className="text-secondary" />
                                        China Verified Gold Supplier
                                    </p>
                                </div>
                            </div>
                            <Link href="#" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-all backdrop-blur-md">
                                Visit Store
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tabs & Details */}
                <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex border-b border-gray-100 bg-gray-50/50">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-10 py-6 text-sm font-bold transition-all relative ${activeTab === tab.id
                                    ? "text-primary bg-white"
                                    : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-10">
                        {activeTab === "overview" && (
                            <div className="space-y-10">
                                <div className="max-w-4xl">
                                    <h3 className="text-2xl font-bold text-text-main mb-6">Product Description</h3>
                                    <p className="text-gray-600 leading-relaxed text-lg">
                                        {product.description}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="p-8 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                                        <Zap size={32} className="text-secondary" strokeWidth={3} />
                                        <h4 className="font-bold text-lg">High Performance</h4>
                                        <p className="text-sm text-gray-500">Advanced hydraulic system ensures smooth and stable lifting operations.</p>
                                    </div>
                                    <div className="p-8 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                                        <Shield size={32} className="text-primary" strokeWidth={3} />
                                        <h4 className="font-bold text-lg">Enhanced Safety</h4>
                                        <p className="text-sm text-gray-500">Automatic pothole protection and emergency lowering system included.</p>
                                    </div>
                                    <div className="p-8 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                                        <BatteryCharging size={32} className="text-green-500" strokeWidth={3} />
                                        <h4 className="font-bold text-lg">Eco-Friendly</h4>
                                        <p className="text-sm text-gray-500">Zero-emission electric drive system suitable for sensitive environments.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "specifications" && (
                            <div className="max-w-4xl overflow-hidden rounded-2xl border border-gray-100">
                                <table className="w-full text-left border-collapse">
                                    <tbody>
                                        {product.specs?.map((spec, i) => (
                                            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                                                <td className="px-8 py-5 text-sm font-bold text-gray-500 border-r border-gray-100 w-1/3 italic">{spec.label}</td>
                                                <td className="px-8 py-5 text-sm text-text-main font-medium">{spec.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "shipping" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="flex flex-col items-center text-center space-y-3 p-6">
                                    <Clock className="text-primary mb-2" size={40} />
                                    <h4 className="font-bold text-text-main">Lead Time</h4>
                                    <p className="text-sm text-gray-500">{product.shipping?.leadTime}</p>
                                </div>
                                <div className="flex flex-col items-center text-center space-y-3 p-6">
                                    <Package className="text-primary mb-2" size={40} />
                                    <h4 className="font-bold text-text-main">MOQ</h4>
                                    <p className="text-sm text-gray-500">{product.shipping?.moq}</p>
                                </div>
                                <div className="flex flex-col items-center text-center space-y-3 p-6">
                                    <Star className="text-primary mb-2" size={40} />
                                    <h4 className="font-bold text-text-main">Stock</h4>
                                    <p className="text-sm text-gray-500">{product.shipping?.stock}</p>
                                </div>
                                <div className="flex flex-col items-center text-center space-y-3 p-6">
                                    <Truck className="text-primary mb-2" size={40} />
                                    <h4 className="font-bold text-text-main">Port</h4>
                                    <p className="text-sm text-gray-500">{product.shipping?.port}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-20">
                    <ProductSection title="Related Products" products={FEATURED_PRODUCTS.slice(0, 4)} />
                </div>
            </div>
        </div>
    );
}

// Simple icons not in Lucide or needing custom style
const Zap = (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const Shield = (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const BatteryCharging = (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19"></path><path d="M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path><path d="M23 13v-2"></path><path d="M11 6l-4 6h6l-4 6"></path></svg>;
