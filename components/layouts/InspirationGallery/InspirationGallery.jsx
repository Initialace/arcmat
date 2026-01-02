"use client";
import { useState } from "react";
import Image from "next/image";
import data from "./data.json";
import InspirationCard from "../../cards/InspirationCard";
import Container from "../../ui/Container";
import Button from "@/components/ui/Button";

const categories = ["All", "Kitchen", "Bedroom", "Furniture", "Decor", "Lighting", "Finishes", "Bathware"];

const InspirationGallery = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedProduct, setSelectedProduct] = useState(null);

    const filteredData = activeCategory === "All"
        ? data
        : data.filter(item => item.category === activeCategory);

    const handleProductClick = (item) => {
        setSelectedProduct(item);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    return (
        <section className="bg-white py-16 relative">
            <Container>
                <h2 className="text-4xl md:text-5xl font-bold text-center text-[#4D4E58] mb-10 tracking-tight">
                    Inspiration Gallery
                </h2>

                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredData.map((item) => (
                        <InspirationCard
                            key={item.id}
                            company={item.company}
                            image={item.image}
                            description={item.description}
                            link={item.link}
                            onViewMore={() => handleProductClick(item)}
                        />
                    ))}
                </div>

                {filteredData.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No items found in this category.
                    </div>
                )}
            </Container>

            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeModal}>
                    <div
                        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative animate-in fade-in zoom-in duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <Image src="/Icons/icons8-close.svg" alt="Close" width={24} height={24} className="w-6 h-6" />
                        </button>

                        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-100">
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.description}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                            <span className="font-bold text-[#d69e76] text-xl italic tracking-wide mb-2">{selectedProduct.company}</span>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Inspiration Product</h3>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">{selectedProduct.description}</p>

                            <div className="flex gap-4 items-center">
                                <Button
                                    text="Contact Supplier"
                                    className="bg-[#e09a74] hover:bg-white hover:text-[#e09a74] border-[#e09a74] border text-white font-medium py-3 px-8 h-auto shadow-sm text-lg"
                                />
                                <Image src="/Icons/Heart.svg" alt="Share" width={24} height={24} className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default InspirationGallery;
