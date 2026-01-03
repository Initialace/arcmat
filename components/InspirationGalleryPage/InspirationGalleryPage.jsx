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
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center"
                    onClick={() => setSelectedProduct(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white w-full md:max-w-4xl rounded-t-2xl md:rounded-xl shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-hidden"
                    >
                        {/* Close */}
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 p-2 bg-white rounded-full"
                        >
                            <X />
                        </button>

                        {/* Image */}
                        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-200">
                            <img
                                src={selectedProduct.image}
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                            <div>
                                <span className="font-bold text-[#d69e76] text-xl italic">
                                    {selectedProduct.company}
                                </span>

                                <h3 className="text-2xl md:text-3xl font-bold mt-2">
                                    Inspiration Product
                                </h3>

                                <p className="text-gray-600 text-lg mt-4">
                                    {selectedProduct.description}
                                </p>
                            </div>

                            {/* Sticky Mobile Actions */}
                            <div className="flex items-center gap-4 mt-6 md:mt-8">
                                <Button
                                    text="Contact Supplier"
                                    className="bg-[#e09a74] hover:bg-white hover:text-[#e09a74] border-[#e09a74] border text-white py-3 px-6 h-auto text-lg"
                                />

                                <Heart
                                    onClick={() => toggleLike(selectedProduct.id)}
                                    className={`w-7 h-7 cursor-pointer transition
                    ${liked[selectedProduct.id]
                                            ? "fill-red-500 text-red-500 scale-110"
                                            : "text-black"
                                        }`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default InspirationGalleryPage;
