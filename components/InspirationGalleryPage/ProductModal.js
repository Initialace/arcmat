"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // <--- 1. Import createPortal
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const ProductModal = ({ product, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [mounted, setMounted] = useState(false); // <--- 2. Add mounted state

    // Wait for client-side mount
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Reset index when product changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [product]);

    const allImages = product ? [product.image, ...(product.images || [])] : [];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    // If not mounted or no product, return nothing
    if (!mounted || !product) return null;

    // 3. Wrap everything in createPortal(JSX, document.body)
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white rounded-full text-gray-800 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Left Side: Image Gallery */}
                <div className="w-full md:w-2/3 bg-[#f4f4f4] relative flex flex-col h-[50vh] md:h-[80vh]">

                    {/* Main Image Stage */}
                    <div className="relative flex-1 w-full h-full group">
                        <img
                            src={allImages[currentImageIndex]}
                            alt={product.company}
                            className="w-full h-full object-cover transition-opacity duration-300"
                        />

                        {/* Navigation Arrows */}
                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#d69e76] hover:text-white"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#d69e76] hover:text-white"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                        <div className="hidden md:flex gap-2 p-4 overflow-x-auto bg-white/50 backdrop-blur-md absolute bottom-0 w-full justify-center">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${currentImageIndex === idx ? "border-[#d69e76] opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side: Product Info */}
                <div className="w-full md:w-1/3 p-8 flex flex-col overflow-y-auto bg-white">
                    <div className="mb-6">
                        <span className="inline-block px-3 py-1 bg-[#fff6f0] text-[#d69e76] text-xs font-semibold rounded-full mb-3 uppercase tracking-wider">
                            {product.category}
                        </span>
                        <h2 className="text-3xl font-serif text-gray-900 mb-2">{product.company}</h2>
                        <div className="h-1 w-12 bg-[#d69e76] rounded-full"></div>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-lg mb-8">
                        {product.description}
                    </p>

                    <div className="mt-auto space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 border-t pt-4 mb-6">
                            <div>
                                <span className="block font-medium text-gray-900">ID Ref</span>
                                #{product.id.toString().padStart(4, '0')}
                            </div>
                            <div>
                                <span className="block font-medium text-gray-900">Images</span>
                                {allImages.length} Shots
                            </div>
                        </div>

                        <a
                            href={product.link}
                            className="flex items-center justify-center gap-2 w-full bg-[#2a2a2a] text-white py-4 rounded-xl font-medium hover:bg-[#d69e76] transition-colors"
                        >
                            Visit Website <ExternalLink size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </div>,
        document.body // <--- Target DOM node
    );
};

export default ProductModal;