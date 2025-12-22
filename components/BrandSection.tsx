import React from "react";

const BrandSection = () => {
    const brands = [
        { name: "XCMG", logo: "https://placehold.co/200x100?text=XCMG" },
        { name: "Caterpillar", logo: "https://placehold.co/200x100?text=CAT" },
        { name: "Komatsu", logo: "https://placehold.co/200x100?text=Komatsu" },
        { name: "Sany", logo: "https://placehold.co/200x100?text=Sany" },
        { name: "Zoomlion", logo: "https://placehold.co/200x100?text=Zoomlion" },
        { name: "Volvo", logo: "https://placehold.co/200x100?text=Volvo" },
    ];

    return (
        <section className="py-14 bg-bg-light">
            <div className="max-w-container mx-auto px-10">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-bold relative pl-[15px] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-5 before:bg-primary">
                        Cooperative Brands
                    </h2>
                </div>
                <div className="grid grid-cols-6 gap-[15px]">
                    {brands.map((brand) => (
                        <div key={brand.name} className="bg-white h-[80px] flex items-center justify-center border border-[#eee] cursor-pointer transition-all hover:shadow-[0_5px_15px_rgba(0,0,0,0.1)] hover:border-primary group">
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="max-w-[80%] max-h-[60%] grayscale opacity-60 transition-all group-hover:grayscale-0 group-hover:opacity-100"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandSection;
