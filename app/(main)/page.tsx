import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import CategoryBar from "@/components/CategoryBar";
import { FEATURED_PRODUCTS } from "@/lib/mockData";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryBar />
      <div style={{ backgroundColor: "var(--white)" }}>
        <ProductSection title="Featured Products" products={FEATURED_PRODUCTS} />
        <ProductSection title="New Arrivals" products={[...FEATURED_PRODUCTS].reverse().slice(0, 4)} />
      </div>
    </>
  );
}
