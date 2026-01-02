"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import Header from "@/components/layouts/Header"
import Navbar from "@/components/navbar/navbar"
import ProductDetailView from "@/components/sections/ProductDetailView"
import Container from "@/components/ui/Container"
import Footer from "@/components/layouts/Footer"
import productsData from '@/app/productlist/data.json'

const ProductDetailPage = () => {
    const params = useParams()
    const productId = parseInt(params.id)

    const product = productsData.find(p => p.id === productId)

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navbar />
            <Container className="py-8">
                <ProductDetailView product={product} />
            </Container>
            <Footer />
        </div>
    )
}

export default ProductDetailPage
