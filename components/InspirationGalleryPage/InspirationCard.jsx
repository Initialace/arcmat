"use client";
import { useState, useEffect, useRef } from "react";

const InspirationCard = ({ company, image, description, onViewMore }) => {
    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setLoaded(true);
        }
    }, []);

    return (
        <div
            onClick={onViewMore}
            className="relative w-full h-full overflow-hidden rounded-xl cursor-pointer group bg-gray-200"
        >
            {/* Skeleton */}
            {!loaded && (
                <div className="absolute inset-0 animate-pulse bg-gray-300 z-0" />
            )}

            {/* Image */}
            <img
                ref={imgRef}
                src={image}
                alt={description}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`relative z-10 w-full h-full object-cover transition-all duration-700
          ${loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105"}
          group-hover:scale-110`}
            />

            {/* Company Name (Top) */}
            <div className="absolute top-4 left-4 z-20">
                <span className=" text-gray-900 text-sm font-bold">
                    {company}
                </span>
            </div>
        </div>
    );
};

export default InspirationCard;
