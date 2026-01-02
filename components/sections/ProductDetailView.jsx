"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules'
import Button from '@/components/ui/Button'
import Accordion from '@/components/ui/Accordion'
import RequestInfo from './RequestInfo'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

const ProductDetailView = ({ product }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null)
    const [isAdded, setIsAdded] = useState(false)
    const images = product.images || []

    const handleAddToCart = () => {
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    return (
        <div className="overflow-hidden flex flex-col gap-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 py-4 md:py-6 lg:py-10 border-b border-gray-400 shadow-lg">
                <div className="space-y-4 lg:px-20 ">
                    <div className="relative aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden">
                        {images.length > 1 ? (
                            <Swiper
                                modules={[Navigation, Pagination, Thumbs]}
                                navigation
                                pagination={{ clickable: true }}
                                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                className="h-full w-full product-detail-swiper"
                            >
                                {images.map((img, idx) => (
                                    <SwiperSlide key={idx}>
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={img}
                                                alt={`${product.name} - Image ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                                priority={idx === 0}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="relative w-full h-full">
                                <Image
                                    src={images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        {product.isNew && (
                            <div className="absolute top-4 left-4 bg-[#e09a74] text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg uppercase z-10">
                                New
                            </div>
                        )}
                    </div>

                    {images.length > 1 && (
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            modules={[Thumbs, FreeMode]}
                            spaceBetween={8}
                            slidesPerView={3}
                            breakpoints={{
                                640: {
                                    slidesPerView: 4,
                                    spaceBetween: 12,
                                },
                                768: {
                                    slidesPerView: 6,
                                    spaceBetween: 12,
                                },
                            }}
                            freeMode={true}
                            watchSlidesProgress={true}
                            className="product-thumbs-swiper"
                        >
                            {images.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#e09a74] transition-all">
                                        <Image
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>

                <div className="flex flex-col">
                    <div className="flex-1 flex flex-col justify-between">

                        <div className="mb-6">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                {product.heading || product.brand}
                            </h4>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                {product.name}
                            </h1>
                            {product.price && (
                                <p className="text-2xl font-bold text-[#e09a74] mb-2">
                                    {product.price}
                                </p>
                            )}
                            <p className="text-lg text-gray-600">
                                {product.subtitle}
                            </p>
                        </div>

                        <div className='flex flex-col gap-3 mb-2 sm:mb-10 md:gap-4 px-8 sm:px-30 '>
                            <Button
                                text="REQUEST PRICES/QUATE"
                                className="w-full bg-white hover:bg-[#e09a74] hover:text-white border-[#e09a74] border text-black font-semibold py-1 md:py-2 px-4 md:px-6 lg:px-8 h-auto shadow-sm text-sm md:text-base lg:text-lg transition-all"
                            />
                            <Button
                                text="REQUEST CATALOGOUS"
                                className="w-full bg-white hover:bg-[#e09a74] hover:text-white border-[#e09a74] border text-black font-semibold py-1 md:py-2 px-4 md:px-6 lg:px-8 h-auto shadow-sm text-sm md:text-base lg:text-lg transition-all"
                            />
                            <Button
                                text="REQUEST BIM/CAD"
                                className="w-full bg-white hover:bg-[#e09a74] hover:text-white border-[#e09a74] border text-black font-semibold py-1 md:py-2 px-4 md:px-6 lg:px-8 h-auto shadow-sm text-sm md:text-base lg:text-lg transition-all"
                            />
                            <Button
                                text="RETAILERS LIST"
                                className="w-full bg-white hover:bg-[#e09a74] hover:text-white border-[#e09a74] border text-black font-semibold py-1 md:py-2 px-4 md:px-6 lg:px-8 h-auto shadow-sm text-sm md:text-base lg:text-lg transition-all"
                            />
                        </div>

                    </div>

                    <div className="mt-4 lg:mt-6">
                        <Button
                            onClick={handleAddToCart}
                            className={`w-full flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 px-4 md:px-6 shadow-lg transform active:scale-95 transition-all text-sm md:text-base font-bold ${isAdded
                                ? 'bg-green-500 text-white border-2 border-green-500'
                                : 'bg-[#e09a74] text-white hover:bg-white hover:text-[#e09a74] border-2 border-[#e09a74]'
                                }`}
                        >
                            <Image
                                src="/Icons/Add Shopping Cart.svg"
                                width={20}
                                height={20}
                                alt=""
                            />
                            <span>{isAdded ? 'Added to Cart!' : 'Add to Cart'}</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 py-2">

                <div className='flex flex-col gap-6'>
                    <div className="mb-2 pb-6 border-b lg:border-b-0 border-gray-200">
                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">
                            Product Description
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                            {product.description || `Premium quality ${product.subtitle.toLowerCase()} from ${product.brand}. Perfect for both residential and commercial applications. This product combines exceptional durability with stunning aesthetics, making it an ideal choice for your next project.`}
                        </p>
                    </div>
                    <div className="mb-6 md:mb-8">
                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">
                            Key Features
                        </h3>
                        <ul className="space-y-2">
                            {(product.keyFeatures || [
                                'High-quality materials and construction',
                                'Easy to install and maintain',
                                'Suitable for various applications',
                                'Available in multiple variants'
                            ]).map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="text-[#e09a74] mt-1">✓</span>
                                    <span className="text-gray-600">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <Accordion
                        items={[
                            {
                                title: 'Dimensions',
                                content: (
                                    <ul className="space-y-2">
                                        {(product.dimensions || ['Dimensions not available']).map((dimension, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-gray-400 mt-1">•</span>
                                                <span>{dimension}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ),
                            },
                            {
                                title: 'Tags',
                                content: (
                                    <div className="flex flex-wrap gap-2">
                                        {(product.tags || ['No tags available']).map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-[#e09a74] hover:text-white transition-colors cursor-pointer"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
                <RequestInfo
                product={product}
                />
            </div>

            <style jsx global>{`
                .product-detail-swiper .swiper-button-next,
                .product-detail-swiper .swiper-button-prev {
                    color: #e09a74;
                    background: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                
                .product-detail-swiper .swiper-button-next:after,
                .product-detail-swiper .swiper-button-prev:after {
                    font-size: 16px;
                    font-weight: bold;
                }
                
                .product-detail-swiper .swiper-pagination-bullet {
                    width: 10px;
                    height: 10px;
                    background: #d1d5db;
                    opacity: 1;
                }
                
                .product-detail-swiper .swiper-pagination-bullet-active {
                    background: #e09a74;
                    width: 24px;
                    border-radius: 5px;
                }
                
                .product-thumbs-swiper .swiper-slide-thumb-active .relative {
                    border-color: #e09a74 !important;
                }
            `}</style>
        </div>
    )
}

export default ProductDetailView
