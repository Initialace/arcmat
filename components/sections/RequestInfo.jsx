import React from 'react'
import Image from 'next/image'
import Button from '../ui/Button'
const RequestInfo = ({ product }) => {
    return (
        <div className="mb-2">

            <div className="bg-[#FFF9E6]">
                <div className="flex items-center gap-2 mb-6 p-1 bg-[#e09a74]">
                    <div className="bg-[#e09a74] rounded-full p-2">
                        <Image width={20} height={20} src="/Images/information.png" alt="info" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">Request for Information</h2>
                </div>

                <div className="grid grid-cols-1 gap-8 py-4 px-4 md:px-6 lg:px-10">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-4 pb-6 border-b border-gray-300">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Get directly in touch with</p>
                                    <h3 className="text-xl font-bold text-gray-900">{product.brand || 'GHIDINI1961'}</h3>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between gap-4 py-2">
                                <div className="flex-1">
                                    <h4 className="text-base font-semibold text-gray-900 mb-3">Request</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#e09a74] focus:ring-[#e09a74]" />
                                            <span className="text-sm text-gray-700">Catalogue</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#e09a74] focus:ring-[#e09a74]" />
                                            <span className="text-sm text-gray-700">Price list</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#e09a74] focus:ring-[#e09a74]" />
                                            <span className="text-sm text-gray-700">BIM/CAD</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#e09a74] focus:ring-[#e09a74]" />
                                            <span className="text-sm text-gray-700">Retailers list</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#e09a74] focus:ring-[#e09a74]" />
                                            <span className="text-sm text-gray-700">Contact representative</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div>
                                        <h4 className="text-base font-semibold text-gray-900 mb-2">Send a message</h4>
                                        <textarea
                                            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a74] focus:border-transparent resize-none"
                                            placeholder="Hello, I would like more information about the product FRAME..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-base font-semibold text-gray-900">Fill in your data</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="First Name *"
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a74] focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Last Name *"
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a74] focus:border-transparent"
                            />
                            <input
                                type="email"
                                placeholder="E-mail *"
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a74] focus:border-transparent"
                            />
                            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e09a74] focus:border-transparent">
                                <option>Profession *</option>
                                <option>Architect</option>
                                <option>Designer</option>
                                <option>Contractor</option>
                                <option>Other</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Company/Studio Name"
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a74] focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="City/Town *"
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a74] focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a74] focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="No."
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a74] focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Postcode"
                                className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a74] focus:border-transparent"
                            />
                            <input
                                type="tel"
                                placeholder="Tel."
                                className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a74] focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">

                        <div className="pt-2">
                            <label className="flex items-start gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 mt-1 rounded border-gray-300 text-[#e09a74] focus:ring-[#e09a74]" />
                                <span className="text-xs text-gray-600 leading-relaxed">
                                    I consent to the transfer of my data to {product.brand || 'GHIDINI1961'} and the brands featured on Archiproducts for marketing purposes
                                </span>
                            </label>
                            <p className="text-xs text-gray-500 mt-2 ml-6">
                                By clicking on Send, I consent to register on the site and share my data with the contacted brand so that it can respond to my request. To this end, I accept the{' '}
                                <a href="#" className="text-[#e09a74] hover:underline">Terms of Use</a> and the{' '}
                                <a href="#" className="text-[#e09a74] hover:underline">Privacy Policy</a> and authorize the processing of my personal data for marketing purposes by Archiproducts. If you are already registered,{' '}
                                <a href="#" className="text-[#e09a74] hover:underline">Login</a>
                            </p>
                        </div>

                        <Button text="SEND" className="w-full md:w-auto bg-[#e09a74] hover:bg-white hover:text-[#e09a74] border-[#e09a74] border text-white font-semibold py-3 px-8 rounded-md transition-colors flex items-center justify-center gap-2">
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RequestInfo