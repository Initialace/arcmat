'use client';

import React from 'react';
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import Container from "@/components/ui/Container";
import BackLink from "@/components/ui/BackLink";
import Button from "@/components/ui/Button";

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className="py-8 bg-white">
                <Container>
                    <div>
                        <div className="mb-6">
                            <BackLink useRouterBack={true} />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-8">About ArcMat</h1>

                        {/* Hero Image */}
                        <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop"
                                alt="Modern architectural workspace"
                                className="w-full h-64 sm:h-96 object-cover"
                            />
                        </div>

                        <div className="prose prose-lg text-gray-700 space-y-8">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
                                <p>
                                    ArcMat was born from a simple frustration: architects and designers were spending countless
                                    hours hunting down product specifications, CAD files, and material samples across dozens of
                                    manufacturer websites. We knew there had to be a better way.
                                </p>
                                <p>
                                    In 2018, our founders—a frustrated architect and a passionate product designer—met at a
                                    design conference and discovered they shared the same pain point. Over coffee, they sketched
                                    out what would become ArcMat: a unified platform where design professionals could discover,
                                    specify, and source everything they need in one place.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6 not-prose my-12">
                                <div className=" p-3 rounded-xl flex flex-col h-full">
                                    <img
                                        src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=400&fit=crop"
                                        alt="Material samples and textures"
                                        className="w-full h-64 object-cover rounded-2xl mb-4"
                                    />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">100,000+ Professionals</h3>
                                    <p className="text-gray-600">
                                        A thriving community of architects, interior designers, and specifiers trust ArcMat daily
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl flex flex-col h-full">
                                    <img
                                        src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop"
                                        alt="3D modeling and BIM files"
                                        className="w-full h-64 object-cover rounded-2xl mb-4"
                                    />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Seamless Integration</h3>
                                    <p className="text-gray-600">
                                        Download BIM, CAD, and 3D files instantly—compatible with all major design software
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                                <p>
                                    We believe great design shouldn't be held back by logistics. Our mission is to bridge the
                                    gap between world-class manufacturers and design professionals, making it effortless to
                                    discover innovative products and bring creative visions to life.
                                </p>
                                <p>
                                    From home to work, from concept to completion—we provide the ideas and tools you need to
                                    design with confidence. Explore comprehensive catalogs, download technical documentation,
                                    and source materials for your projects all in one streamlined platform.
                                </p>
                            </div>

                            <div className="bg-blue-50 p-8 rounded-xl not-prose my-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Join Our Community</h3>
                                <p className="text-gray-700 mb-6">
                                    Be part of a movement that's transforming how design professionals work. Connect with
                                    manufacturers, share insights, and access exclusive resources.
                                </p>
                                <Button
                                    className="bg-blue-600 text-white px-6 py-3  font-medium hover:bg-blue-700 transition"
                                    href="/contact-us"
                                    text={"Get Started Today"}
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </>
    );
}
