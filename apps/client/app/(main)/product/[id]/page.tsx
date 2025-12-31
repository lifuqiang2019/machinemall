"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FEATURED_PRODUCTS } from "@/lib/mockData";
import {
    ChevronRight,
    Star,
    MessageSquare,
    ShieldCheck,
    Clock,
} from "lucide-react";
import ChatWidget from "@/components/ChatWidget";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category?: { name: string };
    images?: string[];
    mainImage?: string;
    specs?: { label: string; value: string }[];
}

export default function ProductDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string>("");

    // Zoom state
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [showZoom, setShowZoom] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:3000/products/${id}`);
                if (!res.ok) throw new Error("Failed to fetch product");
                const data = await res.json();
                setProduct(data);
                // Set initial main image
                if (data.mainImage) {
                    setMainImage(data.mainImage);
                } else if (data.images && data.images.length > 0) {
                    setMainImage(data.images[0]);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPos({ x, y });
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-container mx-auto px-10 py-4 flex items-center gap-2 text-[13px] text-gray-500">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link href="#" className="hover:text-primary transition-colors">{product.category?.name || 'Category'}</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 font-medium truncate max-w-[400px]">{product.name}</span>
                </div>
            </div>

            <div className="max-w-container mx-auto px-10">
                {/* Top Section: Images | Info | Supplier */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    
                    {/* Col 1: Images (30%) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div
                            ref={containerRef}
                            className="bg-white rounded-lg border border-gray-100 relative aspect-square cursor-crosshair group/zoom"
                            onMouseEnter={() => setShowZoom(true)}
                            onMouseLeave={() => setShowZoom(false)}
                            onMouseMove={handleMouseMove}
                        >
                            <div className="absolute inset-0 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                                <Image
                                    src={mainImage || 'https://via.placeholder.com/500'}
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
                            {showZoom && (
                                <div
                                    className="absolute top-0 left-[calc(100%+10px)] w-[500px] h-[500px] bg-white border border-gray-200 shadow-2xl z-50 rounded-lg overflow-hidden hidden lg:block"
                                    style={{
                                        backgroundImage: `url(${mainImage || 'https://via.placeholder.com/500'})`,
                                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                        backgroundSize: '250%',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                />
                            )}
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            {product.images?.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`relative w-16 h-16 rounded-md border flex-shrink-0 transition-all ${mainImage === img ? 'border-primary' : 'border-gray-100 hover:border-gray-300'}`}
                                >
                                    <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover p-1 rounded-md" unoptimized={true} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Col 2: Product Info (45%) */}
                    <div className="lg:col-span-5 px-4 border-r border-gray-100">
                        <h1 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">Model: {product.id}</span>
                            <div className="flex items-center text-yellow-400 text-xs">
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                                <span className="text-gray-400 ml-1">(5.0)</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-2xl font-bold text-primary">¥{product.price}</span>
                                <span className="text-gray-500 text-xs">/ Set (FOB Price)</span>
                            </div>
                            <div className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">Get Best Price &gt;</div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex text-sm">
                                <span className="text-gray-500 w-32 shrink-0">Stock:</span>
                                <span className="text-gray-900 font-medium truncate">{product.stock}</span>
                            </div>
                            {/* Add more dynamic specs if available in backend */}
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2.5 rounded text-sm transition-colors shadow-sm">
                                Send Inquiry
                            </button>
                            <button 
                                onClick={() => window.dispatchEvent(new Event("open-chat"))}
                                className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <MessageSquare size={16} />
                                Live Chat
                            </button>
                        </div>
                    </div>

                    {/* Col 3: Supplier Info (25%) */}
                    <div className="lg:col-span-3 pl-2">
                        <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100 h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary text-white rounded flex items-center justify-center font-bold text-lg">
                                    X
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900 line-clamp-1">XCMG Global Trading</div>
                                    <div className="text-xs text-gray-500">China (Mainland)</div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <ShieldCheck size={14} className="text-green-600" />
                                    <span>Verified Supplier</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Clock size={14} className="text-gray-400" />
                                    <span>3 Years in Business</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <MessageSquare size={14} className="text-gray-400" />
                                    <span>98% Response Rate</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button className="border border-primary text-primary hover:bg-primary hover:text-white text-xs py-2 rounded transition-colors">
                                    Visit Store
                                </button>
                                <button className="border border-gray-300 text-gray-600 hover:border-gray-400 text-xs py-2 rounded transition-colors">
                                    Contact
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banner Ad Area */}
                <div className="my-6 h-[100px] bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg flex items-center justify-center text-white text-2xl font-bold tracking-widest relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://placehold.co/1200x200/003366/FFFFFF/png?text=XCMG+Machmall')] bg-cover bg-center opacity-30"></div>
                    <span className="relative z-10">XCMG | Machmall Construction Machinery</span>
                </div>

                {/* Main Content & Sidebar Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Main Content (Left 9 cols) */}
                    <div className="lg:col-span-9 space-y-8">
                        
                        {/* Description Section - RICH TEXT */}
                        <div id="description" className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm scroll-mt-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-primary pl-4">Product Details</h2>
                            <div 
                                className="prose max-w-none text-gray-600"
                                dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available.</p>' }}
                            />
                        </div>

                    </div>

                    {/* Right Sidebar (3 cols) */}
                    <div className="lg:col-span-3 space-y-6">
                        
                        {/* Recommended Products */}
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">You May Like</h3>
                            <div className="space-y-4">
                                {FEATURED_PRODUCTS.slice(0, 5).map((p) => (
                                    <Link href={`/product/${p.id}`} key={p.id} className="group flex gap-3">
                                        <div className="w-16 h-16 bg-gray-50 rounded border border-gray-100 flex-shrink-0 relative overflow-hidden">
                                            <Image 
                                                src={p.image} 
                                                alt={p.name} 
                                                fill 
                                                className="object-cover" 
                                                unoptimized={true}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-medium text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">{p.name}</h4>
                                            <div className="text-primary font-bold text-xs mt-1">¥{p.price}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Send Inquiry Mini Form */}
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm sticky top-6">
                            <h3 className="font-bold text-gray-900 mb-4">Send your message to this supplier</h3>
                            <div className="space-y-3">
                                <div className="bg-gray-50 p-3 rounded text-xs text-gray-500 border border-gray-200">
                                    To: <span className="font-bold text-gray-900">XCMG Global Trading</span>
                                </div>
                                <textarea 
                                    className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-primary min-h-[100px]"
                                    placeholder="Enter your inquiry details such as product name, color, size, quantity, material, etc."
                                ></textarea>
                                <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded text-sm transition-colors shadow-sm">
                                    Send Inquiry
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* Live Chat Widget */}
            <ChatWidget />
        </div>
    );
}
