"use client";

import Link from "next/link";
import { Search, ShoppingCart, User as UserIcon, Globe, Phone, LogOut, ChevronDown } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const Header = () => {
    const { data: session, isPending } = authClient.useSession();

    return (
        <header className="w-full bg-white border-b border-border-color">
            {/* Top Bar */}
            <div className="bg-bg-light text-[12px] text-text-secondary py-3">
                <div className="max-w-container mx-auto px-10 flex items-center justify-between">
                    <div className="flex gap-[15px] items-center">
                        <span className="hidden sm:inline">Welcome to Machmall!</span>
                        {isPending ? (
                            <span className="w-20 h-3 bg-gray-200 animate-pulse rounded"></span>
                        ) : session ? (
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-text-main">Hello, {session.user.name}</span>
                                <button
                                    onClick={() => authClient.signOut()}
                                    className="flex items-center gap-1 text-primary hover:underline ml-2"
                                >
                                    <LogOut size={12} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-[15px]">
                                <Link href="/login" className="hover:text-primary transition-colors font-medium">Login</Link>
                                <Link href="/register" className="hover:text-primary transition-colors font-medium">Register</Link>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-5">
                        <div className="flex items-center gap-[5px] hover:text-primary cursor-pointer transition-colors">
                            <Phone size={14} />
                            <span>+86-12345678</span>
                        </div>
                        <div className="flex items-center gap-[5px] hover:text-primary cursor-pointer transition-colors border-l pl-5 border-gray-200">
                            <Globe size={14} />
                            <span>English</span>
                            <ChevronDown size={12} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="py-6">
                <div className="max-w-container mx-auto px-10 flex items-center justify-between">
                    <div>
                        <Link href="/">
                            <span className="text-[32px] font-extrabold text-primary tracking-tighter">
                                MACH<span className="text-secondary">MALL</span>
                            </span>
                        </Link>
                    </div>

                    <div className="flex-1 max-w-[600px] mx-10 flex border-2 border-primary rounded-lg overflow-hidden shadow-sm">
                        <input type="text" placeholder="Search for products, brands..." className="flex-1 px-[15px] py-[10px] border-none outline-none text-sm" />
                        <button className="bg-primary text-white border-none px-6 cursor-pointer transition-colors hover:bg-primary-hover flex items-center justify-center">
                            <Search size={20} />
                        </button>
                    </div>

                    <div className="flex gap-[35px]">
                        <Link href={session ? "/profile" : "/login"}>
                            <div className="flex flex-col items-center gap-[4px] text-text-main cursor-pointer text-[13px] hover:text-primary transition-colors group">
                                <div className="p-1 rounded-full group-hover:bg-primary/5 transition-colors">
                                    <UserIcon size={26} />
                                </div>
                                <span>{session ? "Profile" : "Account"}</span>
                            </div>
                        </Link>
                        <div className="flex flex-col items-center gap-[4px] text-text-main cursor-pointer text-[13px] hover:text-primary transition-colors group">
                            <div className="p-1 rounded-full group-hover:bg-primary/5 transition-colors relative">
                                <ShoppingCart size={26} />
                                <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                            </div>
                            <span>Cart</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
