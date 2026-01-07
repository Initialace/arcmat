"use client";
import { useState } from "react";
import Image from "next/image";
import data from "./data.json";
import WeeklySelectionCard from "../../cards/WeeklySelectionCard";
import Button from "../../ui/Button";
import Container from "../../ui/Container";

const WeeklySelections = () => {
    const [visibleCount, setVisibleCount] = useState(8);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const selections = data || [];
    const visibleSelections = selections.slice(0, visibleCount);

    const handleViewMore = () => {
        setVisibleCount((prev) => prev + 8);
    };

    const handleProductClick = (item) => {
        setSelectedProduct(item);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    return (
        <section className="bg-[#ECE6DF] py-12 relative">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#E09A74] mb-10 tracking-wide">
                Weekly Selections
            </h2>
            <Container>


                {/* 🔥 PINTEREST MASONRY GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[...Array(4)].map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className={`flex flex-col gap-4
                ${colIndex === 1 || colIndex === 3 ? "mt-10" : ""}
                ${colIndex >= 2 ? "hidden lg:flex" : "flex"}
              `}
                        >
                            {visibleSelections
                                .filter((_, index) => index % 4 === colIndex)
                                .map((item) => (
                                    <WeeklySelectionCard
                                        key={item.id}
                                        brand={item.brand}
                                        image={item.image}
                                        title={item.title}
                                        description={item.description}
                                        link={item.link}
                                        onViewMore={() => handleProductClick(item)}
                                    />
                                ))}
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                {visibleCount < selections.length && (
                    <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                        <Button
                            onClick={handleViewMore}
                            className="bg-white hover:bg-[#d69e76] hover:text-white border-[#d69e76] border text-[#d69e76] font-medium py-3 px-10 h-auto shadow-sm text-lg rounded-full"
                            text="View More Products"
                        />
                        <Button
                            href="/productlist"
                            className="bg-white hover:bg-[#d69e76] hover:text-white border-[#d69e76] border text-[#d69e76] font-medium py-3 px-10 h-auto shadow-sm text-lg rounded-full"
                            text="View All"
                        />
                    </div>
                )}
            </Container>

            {/* Modal (UNCHANGED) */}
            {selectedProduct && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative animate-in fade-in zoom-in duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <Image
                                src="/Icons/icons8-close.svg"
                                alt="Close"
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                        </button>

                        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-100">
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                            <span className="font-bold text-[#003366] text-xl italic tracking-wide mb-2">
                                {selectedProduct.brand}
                            </span>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                {selectedProduct.title}
                            </h3>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                {selectedProduct.description}
                            </p>

                            <div className="flex gap-4 items-center">
                                <Button
                                    text="Contact Supplier"
                                    className="bg-[#e09a74] hover:bg-white hover:text-[#e09a74] border-[#e09a74] border text-white font-medium py-3 px-8 h-auto shadow-sm text-lg"
                                />
                                <Image
                                    src="/Icons/Heart.svg"
                                    alt="Like"
                                    width={24}
                                    height={24}
                                    className="w-6 h-6"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default WeeklySelections;
