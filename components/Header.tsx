import Link from "next/link";
import { Search, ShoppingCart, User, Globe, Phone } from "lucide-react";

const Header = () => {
    return (
        <header className="w-full bg-white border-b border-border-color">
            {/* Top Bar */}
            <div className="bg-bg-light text-[12px] text-text-secondary py-3">
                <div className="max-w-container mx-auto px-10 flex items-center justify-between">
                    <div className="flex gap-[15px]">
                        <span>Welcome to Machmall!</span>
                        <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
                        <Link href="/register" className="hover:text-primary transition-colors">Register</Link>
                    </div>
                    <div className="flex gap-5">
                        <div className="flex items-center gap-[5px] hover:text-primary cursor-pointer transition-colors">
                            <Phone size={14} />
                            <span>+86-12345678</span>
                        </div>
                        <div className="flex items-center gap-[5px] hover:text-primary cursor-pointer transition-colors">
                            <Globe size={14} />
                            <span>English</span>
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

                    <div className="flex-1 max-w-[600px] mx-10 flex border-2 border-primary rounded overflow-hidden">
                        <input type="text" placeholder="Search for products, brands..." className="flex-1 px-[15px] py-[10px] border-none outline-none text-sm" />
                        <button className="bg-primary text-white border-none px-5 cursor-pointer transition-colors hover:bg-primary-hover">
                            <Search size={20} />
                        </button>
                    </div>

                    <div className="flex gap-[35px]">
                        <div className="flex flex-col items-center gap-[4px] text-text-main cursor-pointer text-[13px] hover:text-primary transition-colors">
                            <User size={26} />
                            <span>Account</span>
                        </div>
                        <div className="flex flex-col items-center gap-[4px] text-text-main cursor-pointer text-[13px] hover:text-primary transition-colors">
                            <ShoppingCart size={26} />
                            <span>Cart</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
