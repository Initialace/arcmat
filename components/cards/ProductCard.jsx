"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../ui/Button'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const ProductCard = ({ product }) => {
    const name = product.product_name || product.name
    const brand = product.brand
    const subtitle = product.sort_description || product.subtitle
    const id = product._id || product.id
    const price = product.selling_price || product.price
    const mrp = product.mrp_price || product.mrp

    const rawImages = product.product_images?.length > 0
        ? product.product_images
        : (Array.isArray(product.images) ? product.images : [product.image || product.product_image1].filter(Boolean));

    const images = rawImages.map(img => {
        if (!img || typeof img !== 'string') return null;
        if (img.startsWith('http') || img.startsWith('data:') || img.startsWith('/')) return img;
        return `http://localhost:8000/api/public/uploads/product/${img}`;
    }).filter(Boolean);

    const hasMultipleImages = images.length > 1
    const [currentImageIdx, setCurrentImageIdx] = React.useState(0)
    const [isAdded, setIsAdded] = React.useState(false)

    const handleAddToCart = () => {
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    return (
        <div className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-transparent hover:border-gray-100 p-3">
            <Link href={`/productdetails/${id}`} className="block">
                <div className="relative aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden">
                    {hasMultipleImages ? (
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            pagination={{ clickable: true }}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            loop={true}
                            onSlideChange={(swiper) => setCurrentImageIdx(swiper.realIndex)}
                            className="h-full w-full product-card-swiper cursor-pointer"
                        >
                            {images.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <Image
                                        src={img}
                                        alt={name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <Image
                            src={images[currentImageIdx] || images[0]}
                            alt={name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    )}

                    {(product.isNew || product.newarrivedproduct === "Active") && (
                        <div className="absolute top-2 left-2 bg-[#e09a74] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase z-10">
                            New
                        </div>
                    )}
                    {(product.trendingproduct === "Active") && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase z-10">
                            Trending
                        </div>
                    )}
                </div>

                <div className="flex flex-col flex-1 px-3">
                    <div className="flex items-center gap-1.5 mb-3">
                        {images?.map((sv, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (idx < images.length) setCurrentImageIdx(idx)
                                }}
                                className={`w-5 h-5 rounded-md border transition-all overflow-hidden shrink-0 ${currentImageIdx === idx ? 'ring-2 ring-[#e09a74] ring-offset-1 border-transparent' : 'border-gray-200'}`}
                            >
                                <Image src={sv} width={20} height={20} alt="color" className="object-cover w-full h-full" />
                            </button>
                        ))}
                        {product.moreVariants && (
                            <span className="text-[11px] font-medium text-gray-500 ml-0.5">{product.moreVariants}</span>
                        )}
                    </div>

                    <h4 className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{name}</h4>
                    <h3 className="text-[13px] font-semibold text-gray-800 leading-tight mb-1 group-hover:text-[#e09a74] transition-colors">{brand}</h3>
                    <p className="text-[12px] font-normal text-gray-500 mb-4 line-clamp-1">{subtitle}</p>
                    {price && (
                        <p className="text-[14px] font-bold text-[#e09a74] mb-2">₹{price}</p>
                    )}
                </div>
            </Link>

            <div className="px-3">
                <Button
                    onClick={handleAddToCart}
                    className={`mt-auto w-full flex items-center justify-center gap-2 py-2 px-4 shadow-sm transform active:scale-95 transition-all text-[12px] font-semibold border ${isAdded
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-[#e09a74] border-[#e09a74] text-white hover:bg-white hover:text-[#e09a74]'
                        }`}
                >

                    <Image src="/Icons/Add Shopping Cart.svg" width={16} height={16} alt="" />

                    <span>{isAdded ? 'Added!' : 'Add to Cart'}</span>
                </Button>
            </div>

            <style jsx global>{`
                .product-card-swiper .swiper-pagination-bullet {
                    width: 6px;
                    height: 6px;
                    background: #fff;
                    opacity: 0.6;
                }
                .product-card-swiper .swiper-pagination-bullet-active {
                    background: #e09a74;
                    opacity: 1;
                    width: 14px;
                    border-radius: 4px;
                }
                .product-card-swiper .swiper-pagination {
                    bottom: 8px !important;
                }
            `}</style>
        </div>
    )
}

export default ProductCard
