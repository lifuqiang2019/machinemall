import Link from "next/link";
// import { Product } from "@/lib/mockData";

interface Product {
    id: number;
    name: string;
    price: string | number;
    category?: { name: string } | string;
    mainImage?: string;
    images?: string[];
}

interface ProductSectionProps {
    title: string;
    categoryId?: number;
    initialProducts?: Product[];
}

const ProductSection = async ({ title, categoryId, initialProducts }: ProductSectionProps) => {
    let products = initialProducts || [];

    if (!initialProducts && categoryId) {
        try {
            // Server Component Data Fetching
            const res = await fetch(`http://localhost:3000/products?categoryId=${categoryId}&limit=8`, {
                next: { revalidate: 60 } // Revalidate every 60 seconds
            });
            if (res.ok) {
                products = await res.json();
            }
        } catch (error) {
            console.error("Failed to fetch products for section", title, error);
        }
    }

    return (
        <section className="py-12">
            <div className="max-w-container mx-auto px-10">
                <div className="flex justify-between items-center mb-[25px]">
                    <h2 className="text-2xl font-bold relative pl-[15px] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-5 before:bg-primary">
                        {title}
                    </h2>
                    <button className="bg-none border border-border-color py-2 px-5 rounded-[20px] cursor-pointer text-sm transition-all hover:border-primary hover:text-primary">
                        View More
                    </button>
                </div>
                <div className="grid grid-cols-4 gap-5">
                    {products.map((product) => (
                        <Link href={`/product/${product.id}`} key={product.id}>
                            <div className="bg-white border border-transparent p-[15px] transition-all cursor-pointer hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:border-gray-200 group h-full">
                                <div className="w-full aspect-[4/3] overflow-hidden mb-[15px]">
                                    <img
                                        src={product.mainImage || (product.images && product.images[0]) || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-text-muted block mb-[5px]">
                                        {typeof product.category === 'object' ? product.category?.name : product.category}
                                    </span>
                                    <h3 className="text-[15px] font-semibold mb-[10px] h-10 overflow-hidden line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-lg text-[#e4393c] font-bold mb-[15px]">¥{product.price}</p>
                                    <button className="w-full p-[10px] bg-white border border-primary text-primary font-semibold cursor-pointer transition-all group-hover:bg-primary group-hover:text-white mt-auto">
                                        Inquiry Now
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductSection;
