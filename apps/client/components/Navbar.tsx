import Link from "next/link";
import { Menu } from "lucide-react";

const NAV_ITEMS = ["Home", "Used Equipment", "On Sale", "RFQ", "News", "About XCMG"];

const Navbar = () => {
    return (
        <nav className="bg-white border-b-2 border-primary h-[54px]">
            <div className="max-w-container mx-auto px-10 flex items-center h-full">
                <div className="bg-primary text-white h-full px-[25px] flex items-center gap-[10px] font-semibold cursor-pointer w-[240px]">
                    <Menu size={20} />
                    <span>All Categories</span>
                </div>
                <ul className="list-none flex gap-[30px] pl-[40px]">
                    {NAV_ITEMS.map((item) => (
                        <li key={item}>
                            <Link href={`/${item.toLowerCase().replace(/\s+/g, "-")}`} className="text-[15px] font-medium text-text-main transition-colors hover:text-primary">
                                {item}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
