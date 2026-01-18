"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules'
import Button from '@/components/ui/Button'
import Accordion from '@/components/ui/Accordion'
import RequestInfo from './RequestInfo'
import Link from 'next/link'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

const ProductDetailView = ({ product, categories = [], childCategories = [] }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null)
    const [isAdded, setIsAdded] = useState(false)

    if (!product) return null

    const name = product.product_name || product.name
    const price = product.selling_price || product.price
    const mrp = product.mrp_price || product.mrp
    const subtitle = product.sort_description || product.subtitle
    const description = product.description
    const hasPrice = Boolean(price && Number(price) > 0);

    const rawImages = product.product_images?.length > 0
        ? product.product_images
        : (Array.isArray(product.images) ? product.images : [product.image || product.product_image1].filter(Boolean));

    const images = rawImages.map(img => {
        if (!img || typeof img !== 'string') return null;
        if (img.startsWith('http') || img.startsWith('data:') || img.startsWith('/')) return img;
        return `http://localhost:8000/api/public/uploads/product/${img}`;
    }).filter(Boolean);

    const handleAddToCart = () => {
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    const sku = product.skucode || product.sku || product.product_code || 'N/A'
    const stockStatus = product.stock_status || (product.stock > 0 || product.available_stock > 0 ? 'In Stock' : 'Out of Stock')
    const stockColor = stockStatus?.toLowerCase().includes('in stock') ? 'text-green-600' : 'text-red-500'
    const weight = product.weight ? `${product.weight} ${product.weight_type || product.weight_unit || 'kg'}` : null

    // Parse dynamic attributes
    const dynamicAttributes = product.dynamicAttributes ?
        (typeof product.dynamicAttributes === 'string' ? JSON.parse(product.dynamicAttributes) : product.dynamicAttributes)
        : [];

    return (
        <div className="overflow-hidden flex flex-col gap-6 md:gap-16">
            {/* Breadcrumbs */}
            <nav className="flex text-sm text-gray-500 mb-2 overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link href="/" className="hover:text-[#e09a74] transition-colors">Home</Link>
                <span className="mx-2">/</span>
                <Link href="/productlist" className="hover:text-[#e09a74] transition-colors">Products</Link>
                {categories && categories.length > 0 && (
                    <>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">
                            {categories[categories.length - 1].name}
                        </span>
                    </>
                )}
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 py-4 md:py-6 lg:py-10 border-b border-gray-400 shadow-lg bg-white rounded-2xl">
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
                                                alt={`${name} - Image ${idx + 1}`}
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
                                    alt={name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        {(product.isNew || product.newarrivedproduct === "Active") && (
                            <div className="absolute top-4 left-4 bg-[#e09a74] text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase z-10 animate-pulse">
                                New
                            </div>
                        )}
                        {product.featuredproduct === "Active" && (
                            <div className="absolute top-4 right-4 bg-blue-500 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase z-10">
                                Featured
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
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold text-[#e09a74] bg-[#e09a74]/10 px-2 py-0.5 rounded tracking-wider uppercase">
                                    {product.brand || 'Premium'}
                                </span>
                                {product.createdBy?.name && (
                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded tracking-wider uppercase">
                                        By {product.createdBy.name}
                                    </span>
                                )}
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase bg-gray-100 ${stockColor}`}>
                                    {stockStatus}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                                {name}
                            </h1>
                            {hasPrice ? (
                                <div className="flex items-baseline gap-3 mb-3">
                                    <span className="text-2xl md:text-3xl font-bold text-[#e09a74]">₹{price}</span>
                                    {mrp > price && (
                                        <span className="text-sm md:text-base text-gray-400 line-through font-normal">₹{mrp}</span>
                                    )}
                                </div>
                            ) : null}
                            <p className="text-base md:text-lg text-gray-600 leading-relaxed italic">
                                "{subtitle}"
                            </p>

                            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">SKU Code</p>
                                    <p className="text-sm font-medium text-gray-800">{sku}</p>
                                </div>
                                {weight && (
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Weight</p>
                                        <p className="text-sm font-medium text-gray-800">{weight}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='flex flex-col gap-3 mb-2 sm:mb-10 md:gap-4 px-8 sm:px-30 '>
                            {!hasPrice && (
                                <>
                                    <Button
                                        text="REQUEST PRICES/QUATE"
                                        className="w-full bg-white hover:bg-[#e09a74] hover:text-white border-[#e09a74] border text-black font-semibold py-1 md:py-2 px-4 md:px-6 lg:px-8 h-auto shadow-sm text-sm md:text-base lg:text-lg transition-all"
                                    />
                                    <Button
                                        text="REQUEST CATALOGOUS"
                                        className="w-full bg-white hover:bg-[#e09a74] hover:text-white border-[#e09a74] border text-black font-semibold py-1 md:py-2 px-4 md:px-6 lg:px-8 h-auto shadow-sm text-sm md:text-base lg:text-lg transition-all"
                                    />
                                </>
                            )}
                            <Button
                                text="REQUEST BIM/CAD"
                                className="w-full bg-white hover:bg-[#e09a74] hover:text-white border-[#e09a74] border text-black font-semibold py-1 md:py-2 px-4 md:px-6 lg:px-8 h-auto shadow-sm text-sm md:text-base lg:text-lg transition-all"
                            />
                            {/* <Button
                                text="RETAILERS LIST"
                                className="w-full bg-white hover:bg-[#e09a74] hover:text-white border-[#e09a74] border text-black font-semibold py-1 md:py-2 px-4 md:px-6 lg:px-8 h-auto shadow-sm text-sm md:text-base lg:text-lg transition-all"
                            /> */}
                        </div>

                    </div>

                    {hasPrice && (
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
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 py-2">

                <div className='flex flex-col gap-8'>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-[#e09a74] rounded-full"></span>
                            Product Description
                        </h3>
                        <div
                            className="text-sm md:text-base text-gray-600 leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: description || `Premium quality ${subtitle?.toLowerCase() || ''} from ${product.brand || 'Arcmat'}.` }}
                        />
                    </div>

                    {dynamicAttributes.length > 0 && (
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-gray-400 rounded-full"></span>
                                Specifications
                            </h3>
                            <div className="grid grid-cols-1 gap-y-2">
                                {dynamicAttributes.map((attr, idx) => (
                                    <div key={idx} className="flex border-b border-gray-200 py-2 last:border-0 hover:bg-gray-100/50 transition-colors px-2 rounded">
                                        <span className="w-1/3 text-sm font-bold text-gray-500 uppercase tracking-wider">
                                            {attr.attributeName || attr.key}
                                        </span>
                                        <span className="w-2/3 text-sm text-gray-800 font-medium">
                                            {attr.attributeValue || attr.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-[#e09a74] rounded-full"></span>
                            Key Features
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(product.keyFeatures || [
                                'Premium high-quality construction',
                                'Easy installation & minimal maintenance',
                                'Versatile application support',
                                'Multiple aesthetic variants'
                            ]).map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:shadow-inner transition-all group">
                                    <div className="w-8 h-8 rounded-full bg-[#e09a74]/10 flex items-center justify-center group-hover:bg-[#e09a74] transition-colors">
                                        <span className="text-[#e09a74] font-bold group-hover:text-white transition-colors">✓</span>
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Accordion
                        items={[
                            {
                                title: 'Shipping & Dimensions',
                                content: (
                                    <div className="grid grid-cols-1 gap-4">
                                        <ul className="space-y-3">
                                            {(product.dimensions || ['Standard sizing applies', 'Contact vendor for custom dimensions']).map((dimension, idx) => (
                                                <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                                    {dimension}
                                                </li>
                                            ))}
                                        </ul>
                                        {weight && (
                                            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100 flex justify-between items-center text-sm">
                                                <span className="font-bold text-blue-700">Estimated Weight</span>
                                                <span className="text-blue-900">{weight}</span>
                                            </div>
                                        )}
                                    </div>
                                ),
                            },
                            {
                                title: 'Materials & Tags',
                                content: (
                                    <div className="flex flex-wrap gap-2">
                                        {(product.tags || product.category_name || 'Arcmat Collection').split(',').map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold hover:bg-[#e09a74] hover:text-white transition-all cursor-pointer border border-gray-100"
                                            >
                                                #{tag.trim()}
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
