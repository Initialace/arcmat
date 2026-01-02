"use client";

import Link from "next/link";
import { cn } from "./utils";

export const MegaMenuContent = ({ activeCategory, hoveredCategory, image }) => {
    return (
        <div className="flex-1 bg-[#ead4ce] p-8 flex justify-between gap-12 min-w-[600px]">
            <div
                key={hoveredCategory}
                className="flex-1 animate-fade-in flex flex-col"
            >
                <h3 className="text-xl font-bold mb-6 text-[hsl(20,10%,15%)]">
                    {activeCategory?.name}
                </h3>

                <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                    {activeCategory?.links?.map((column, colIndex) => (
                        <ul key={colIndex} className="space-y-3">
                            {column.map((link) => (
                                <li key={link}>
                                    <Link
                                        href="#"
                                        className="text-sm text-[hsl(20,10%,15%)]/80 hover:text-[hsl(20,10%,15%)] transition-colors block font-normal"
                                    >
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
            </div>

            {/* Featured image area */}
            <div className="w-[280px] shrink-0 hidden lg:block self-start">
                <div className="w-50 aspect-2/3 rounded-xl overflow-hidden shadow-md bg-white">
                    <img
                        src={image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=800&fit=crop"}
                        alt={activeCategory?.name || "Featured Category"}
                        className="w-full h-full object-fit hover:scale-105 transition-transform duration-700 ease-out"
                    />
                </div>
            </div>
        </div>
    );
};
