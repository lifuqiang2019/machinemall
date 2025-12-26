import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-border-color pt-14">
            <div className="max-w-container mx-auto px-10">
                <div className="grid grid-cols-4 gap-10 mb-14">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold mb-5 text-text-main">About Machmall</h3>
                        <ul className="list-none flex flex-col gap-[10px]">
                            <li><Link href="#" className="text-[14px] text-text-secondary hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="#" className="text-[14px] text-text-secondary hover:text-primary transition-colors">About XCMG</Link></li>
                            <li><Link href="#" className="text-[14px] text-text-secondary hover:text-primary transition-colors">Membership</Link></li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold mb-5 text-text-main">Customer Service</h3>
                        <ul className="list-none flex flex-col gap-[10px]">
                            <li><Link href="#" className="text-[14px] text-text-secondary hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="text-[14px] text-text-secondary hover:text-primary transition-colors">How to Buy</Link></li>
                            <li><Link href="#" className="text-[14px] text-text-secondary hover:text-primary transition-colors">RFQ</Link></li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold mb-5 text-text-main">Products</h3>
                        <ul className="list-none flex flex-col gap-[10px]">
                            <li><Link href="#" className="text-[14px] text-text-secondary hover:text-primary transition-colors">Excavators</Link></li>
                            <li><Link href="#" className="text-[14px] text-text-secondary hover:text-primary transition-colors">Cranes</Link></li>
                            <li><Link href="#" className="text-[14px] text-text-secondary hover:text-primary transition-colors">Used Equipment</Link></li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold mb-5 text-text-main">Social Media</h3>
                        <div className="flex gap-[15px]">
                            <span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-text-secondary cursor-pointer hover:bg-primary hover:text-white transition-all">FB</span>
                            <span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-text-secondary cursor-pointer hover:bg-primary hover:text-white transition-all">TW</span>
                            <span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-text-secondary cursor-pointer hover:bg-primary hover:text-white transition-all">LI</span>
                            <span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-text-secondary cursor-pointer hover:bg-primary hover:text-white transition-all">YT</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-bg-light py-8 text-center text-text-muted text-[13px] border-t border-gray-200">
                <div className="max-w-container mx-auto px-10">
                    <p>&copy; {new Date().getFullYear()} Machmall.com. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
