"use client";

import { useState, useEffect } from "react";
import data from "./data.json";
import InspirationCard from "./InspirationCard";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { X, Heart } from "lucide-react";

const categories = [
    "All",
    "Kitchen",
    "Bedroom",
    "Furniture",
    "Decor",
    "Lighting",
    "Finishes",
    "Bathware",
];

const InspirationGalleryPage = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [visibleCount, setVisibleCount] = useState(8);
    const [liked, setLiked] = useState({});

    /* Persist likes */
    useEffect(() => {
        const saved = localStorage.getItem("liked-products");
        if (saved) setLiked(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("liked-products", JSON.stringify(liked));
    }, [liked]);

    const filteredData =
        activeCategory === "All"
            ? data
            : data.filter((item) => item.category === activeCategory);

    const visibleData = filteredData.slice(0, visibleCount);

    const toggleLike = (id) => {
        setLiked((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <section className="bg-white py-16 relative">
            {/* Categories */}
            <Container id="gallery-start">
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => {
                                setActiveCategory(category);
                                setVisibleCount(8);
                            }}
                            className={`px-6 py-2 rounded-full border transition-all duration-300 text-sm md:text-base font-medium
              ${activeCategory === category
                                    ? "bg-[#d69e76] border-[#d69e76] text-white shadow-md"
                                    : "bg-white border-[#d69e76] text-[#6b6b6b] hover:bg-[#fff6f0]"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </Container>

            {/* Gallery */}
            <div className="p-4 md:p-8 bg-[#ece6df]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[...Array(4)].map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className={`flex flex-col gap-4
                ${colIndex === 1 || colIndex === 3 ? "mt-10" : ""}
                ${colIndex >= 2 ? "hidden lg:flex" : "flex"}
              `}
                        >
                            {visibleData
                                .filter((_, index) => index % 4 === colIndex)
                                .map((item) => (
                                    <div key={item.id} className="relative h-[350px]">
                                        <InspirationCard
                                            company={item.company}
                                            image={item.image}
                                            description={item.description}
                                            onViewMore={() => setSelectedProduct(item)}
                                        />
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>
                {/* Show More / Show Less */}
                <div className="flex justify-center gap-4 mt-12 mb-20">
                    {visibleCount < filteredData.length && (
                        <Button
                            text="Show More"
                            onClick={() => setVisibleCount((p) => p + 8)}
                            className="bg-white hover:bg-[#d69e76] hover:text-white border-[#d69e76] border text-[#d69e76] font-medium py-3 px-10 h-auto shadow-sm text-lg rounded-full"
                        />
                    )}
                    {visibleCount > 8 && (
                        <Button
                            text="Show Less"
                            onClick={() => {
                                setVisibleCount(8);
                                document.getElementById("gallery-start")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="bg-white hover:bg-[#d69e76] hover:text-white border-[#d69e76] border text-[#d69e76] font-medium py-3 px-10 h-auto shadow-sm text-lg rounded-full"
                        />
                    )}
                </div>
            </div>

            {/* Modal */}
            {selectedProduct && (
                <div
                    className="fixed inset-0 z-150 bg-black/70 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 "
                    onClick={() => setSelectedProduct(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-gradient-to-br from-white to-gray-50 w-full md:max-w-5xl rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col md:flex-row max-h-[95vh] overflow-hidden"
                    >
                        {/* Close */}
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-5 right-5 p-2.5 bg-white/90 backdrop-blur-sm rounded-full z-10 shadow-lg hover:bg-[#d69e76] hover:text-white transition-all duration-300 group"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-[45%] h-72 md:h-auto bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                            <img
                                src={selectedProduct.image}
                                loading="lazy"
                                alt={selectedProduct.description}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                <span className="inline-block px-4 py-1.5 bg-white/95 backdrop-blur-sm text-[#d69e76] text-xs font-bold rounded-full shadow-lg">
                                    {selectedProduct.category}
                                </span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col overflow-y-auto">
                            <div className="flex-1">
                                {/* Company Badge */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d69e76] to-transparent"></div>
                                    <span className="font-bold text-[#d69e76] text-lg italic px-3 py-1 bg-[#fff6f0] rounded-full">
                                        {selectedProduct.company}
                                    </span>
                                    <div className="h-px flex-1 bg-gradient-to-r from-[#d69e76] via-transparent to-transparent"></div>
                                </div>

                                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                                    Inspiration Product
                                </h3>

                                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                                    {selectedProduct.description}
                                </p>

                                {/* Product Details */}
                                <div className="bg-gradient-to-br from-[#fff6f0] to-white rounded-2xl p-5 mb-6 border border-[#d69e76]/20 shadow-sm">
                                    <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                                        <div className="w-1 h-5 bg-[#d69e76] rounded-full"></div>
                                        Product Details
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1 font-medium">CATEGORY</p>
                                            <p className="text-gray-800 font-semibold">{selectedProduct.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1 font-medium">BRAND</p>
                                            <p className="text-gray-800 font-semibold">{selectedProduct.company}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1 font-medium">STYLE</p>
                                            <p className="text-gray-800 font-semibold">Modern & Contemporary</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1 font-medium">AVAILABILITY</p>
                                            <p className="text-green-600 font-bold flex items-center gap-1">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                In Stock
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-6">
                                    <h4 className="font-bold text-gray-800 mb-3 text-base">Key Features</h4>
                                    <ul className="space-y-2.5">
                                        <li className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="text-[#d69e76] font-bold mt-0.5">✓</span>
                                            Premium quality materials and craftsmanship
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="text-[#d69e76] font-bold mt-0.5">✓</span>
                                            Perfect for modern interior designs
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="text-[#d69e76] font-bold mt-0.5">✓</span>
                                            Elegant aesthetics with functionality
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="text-[#d69e76] font-bold mt-0.5">✓</span>
                                            Trusted supplier with quick delivery
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 pt-5 border-t-2 border-gray-100">
                                <Button
                                    text="Contact Supplier"
                                    className="bg-gradient-to-r from-[#e09a74] to-[#d69e76] hover:from-[#d69e76] hover:to-[#c88a66] text-white py-3.5 px-8 h-auto text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex-1 rounded-xl"
                                />

                                <button
                                    onClick={() => toggleLike(selectedProduct.id)}
                                    className="p-3.5 bg-white border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all duration-300 group"
                                >
                                    <Heart
                                        className={`w-6 h-6 transition-all duration-300
                                            ${liked[selectedProduct.id]
                                                ? "fill-red-500 text-red-500 scale-110"
                                                : "text-gray-400 group-hover:text-red-400 group-hover:scale-110"
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default InspirationGalleryPage;