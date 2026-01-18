"use client"
import Image from 'next/image'
import React, { useState, useRef, useEffect } from 'react'
import Button from '../ui/Button'
import Container from '../ui/Container'
import navbarItems from "../layouts/Navbar/Items.json"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth';
import Cookies from 'js-cookie';
import { LogOut, User, ChevronDown, Heart, Folder, ShoppingCart, LayoutDashboard, Menu, Search, Camera } from 'lucide-react';
import { useSidebarStore } from '@/store/useSidebarStore';

const Header = ({ variant = 'default' }) => {

    const isDashboard = variant === 'dashboard';

    const [searchText, setSearchText] = useState("")
    const [isOpen, setIsOpen] = React.useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const pathname = usePathname();
    const { toggleMobileSidebar } = useSidebarStore();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                desktopProfileRef.current &&
                desktopProfileRef.current.contains(event.target)
            ) return;

            if (
                mobileProfileRef.current &&
                mobileProfileRef.current.contains(event.target)
            ) return;

            setProfileOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const { user, isAuthenticated, logout, loading } = useAuth();
    const handleChange = (e) => {
        setSearchText(e.target.value)
    }

    const desktopProfileRef = useRef(null);
    const mobileProfileRef = useRef(null);

    return (
        <header className='w-full border-b border-gray-200 bg-white sticky top-0 z-[100]'>
            <Container className="h-16 flex items-center justify-between gap-4">
                <div className='flex items-center gap-2'>

                    {/* Hamburger Menu - Visible on mobile for all pages */}
                    <button
                        onClick={toggleMobileSidebar}
                        className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        aria-label="Toggle Menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* {isOpen && (
                        <ul className="xl:hidden flex flex-col gap-4 py-4 text-[16px] font-semibold text-[#4D4E58] bg-white absolute top-full left-0 w-full z-50 shadow-md px-6">
                            {navbarItems.map((item) => (
                                <li key={item.id}
                                    onClick={() => setIsOpen(false)}
                                    className={`cursor-pointer whitespace-nowrap hover:text-gray-500 ${item.highlight ? "text-orange-500 text-xl hover:text-orange-700" : ""}`}>
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    )} */}

                    <div className='flex-shrink-0'>
                        <Link href="/"
                            className='flex items-center gap-2'>
                            <Image
                                src="/Icons/arcmatlogo.svg"
                                alt="ArcMat Logo"
                                width={30}
                                height={30}
                                className="object-contain h-8 w-auto"
                                priority
                            />

                        </Link>
                    </div>
                </div>

                {/* Search Bar - Hidden on Vendor Dashboard */}
                {(!isDashboard || user?.role !== 'vendor') && (
                    <div className='hidden md:flex flex-1 max-w-2xl mx-4'>
                        <div className="relative w-full group">
                            <div className="flex items-center w-full bg-gray-100/80 hover:bg-gray-100 transition-colors rounded-full px-4 h-11 border border-transparent focus-within:border-gray-300 focus-within:bg-white focus-within:shadow-sm">
                                <div className="flex-shrink-0 mr-3 opacity-50">
                                    <Search size={18} />
                                </div>

                                <input
                                    type="text"
                                    onChange={handleChange}
                                    className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-[15px] w-full"
                                    placeholder="Search materials, products, brands and more"
                                />

                                <div className="flex-shrink-0 ml-3 cursor-pointer hover:opacity-80 transition-opacity">
                                    <Camera size={22} className="opacity-60" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 lg:gap-6 flex-shrink-0">
                    {(!isDashboard || user?.role !== 'vendor') && (
                        <>
                            <button className='p-2 hover:bg-gray-50 rounded-full transition-colors hidden sm:flex'>
                                <Image src="/Icons/ai_icon.png" alt="AI Tools" width={28} height={28} />
                            </button>

                            <div className='h-6 w-px bg-gray-200 hidden sm:block'></div>
                        </>
                    )}

                    <div className='flex items-center  sm:gap-4'>
                        {(!user || user.role !== 'vendor') && (
                            <>
                                <button className='p-2 hover:bg-gray-50 rounded-full transition-colors'>
                                    <Heart size={22} className="text-gray-600" />
                                </button>
                                <button className='p-2 hover:bg-gray-50 rounded-full transition-colors hidden lg:block'>
                                    <Folder size={22} className="text-gray-600" />
                                </button>
                            </>
                        )}
                        {(!user || user.role !== 'vendor') && (
                            <Link href="/cart">
                                <button className='p-2 hover:bg-gray-50 rounded-full transition-colors'>
                                    <ShoppingCart size={22} className="text-gray-600" />
                                </button>
                            </Link>
                        )}
                    </div>

                    <div className='hidden lg:flex items-center gap-2 min-w-[100px] justify-end'>
                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                        ) : isAuthenticated && user ? (
                            <div ref={desktopProfileRef} className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 border border-gray-200 rounded-full py-1.5 px-4 hover:shadow-sm transition-all bg-white"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#e09a74] text-white flex items-center justify-center font-bold text-sm overflow-hidden border-2 border-gray-100 shadow-sm">
                                        {user.profileImage ? (
                                            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            (user.name || user.fullName || Cookies.get('name') || user.email || 'U').charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <span className="font-medium text-[#4D4E58] text-[15px] truncate max-w-[120px]">
                                        {user.name || user.fullName || Cookies.get('name') || user.email?.split('@')[0] || 'User'}
                                    </span>
                                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {profileOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                            <p className="text-sm font-semibold text-[#4D4E58] truncate">{user.name || user.fullName}</p>
                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                        </div>

                                        <Link href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#fcf6f3] hover:text-[#e09a74] transition-colors">
                                            <User size={16} />
                                            Profile
                                        </Link>

                                        {!pathname?.startsWith('/dashboard') && (
                                            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#fcf6f3] hover:text-[#e09a74] transition-colors">
                                                <LayoutDashboard size={16} />
                                                Dashboard
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => {
                                                logout();
                                                setProfileOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Button
                                href="/auth/login"
                                className="border border-[#e09a74] font-semibold bg-white text-[#4D4E58] hover:bg-[#e09a74] hover:text-white px-6 py-2 h-auto text-[15px]"
                                text="Sign In"
                            />
                        )}
                    </div>


                    <div ref={mobileProfileRef} className="relative lg:hidden">
                        {isAuthenticated && user ? (
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="p-1 hover:bg-gray-50 rounded-full transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#e09a74] text-white flex items-center justify-center font-bold text-sm overflow-hidden border border-gray-200">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        (user.name || user.fullName || Cookies.get('name') || user.email || 'U').charAt(0).toUpperCase()
                                    )}
                                </div>
                            </button>
                        ) : (
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                            >
                                <User size={24} className="text-gray-600" />
                            </button>
                        )}

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                                {isAuthenticated && user ? (
                                    <>
                                        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                            <p className="text-sm font-semibold text-[#4D4E58] truncate">
                                                {user.name || user.fullName}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                        </div>

                                        <Link
                                            href="/profile"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#fcf6f3] hover:text-[#e09a74]"
                                        >
                                            <User size={16} />
                                            Profile
                                        </Link>

                                        {(!user || user.role !== 'vendor') && (
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#fcf6f3] hover:text-[#e09a74]"
                                            >
                                                <Folder size={16} />
                                                Projects
                                            </Link>
                                        )}

                                        {!pathname?.startsWith('/dashboard') && (
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#fcf6f3] hover:text-[#e09a74]"
                                            >
                                                <LayoutDashboard size={16} />
                                                Dashboard
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => {
                                                logout();
                                                setProfileOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 text-left"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        onClick={() => setProfileOpen(false)}
                                        className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </Container>
        </header>
    )
}

export default Header
