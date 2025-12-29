import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import CategoryBar from "@/components/CategoryBar";
import { FEATURED_PRODUCTS } from "@/lib/mockData";

async function getLayoutConfig() {
  try {
    const res = await fetch('http://localhost:3000/layout', {
      cache: 'no-store' // Ensure dynamic
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch layout config", e);
    return [];
  }
}

export default async function Home() {
  const layoutModules = await getLayoutConfig();

  // If no layout configured, show default static layout
  if (layoutModules.length === 0) {
      return (
        <>
          <Hero />
          <CategoryBar />
          <div style={{ backgroundColor: "var(--white)" }}>
            <ProductSection title="Featured Products" initialProducts={FEATURED_PRODUCTS} />
            <ProductSection title="New Arrivals" initialProducts={[...FEATURED_PRODUCTS].reverse().slice(0, 4)} />
          </div>
        </>
      );
  }

  return (
    <>
      {/* <Hero />  <-- Removed static hero to rely on dynamic layout */}
      {/* <CategoryBar /> <-- Removed static category bar */}
      <div style={{ backgroundColor: "var(--white)" }}>
        {layoutModules.map((module: any) => {
            if (!module.isActive) return null;

            if (module.type === 'hero') {
                return <Hero key={module.id} slides={module.config?.slides} />;
            }

            if (module.type === 'category_bar') {
                return <CategoryBar key={module.id} categories={module.categories} />;
            }
            
            if (module.type === 'product_section') {
                return (
                    <ProductSection 
                        key={module.id} 
                        title={module.name} 
                        categoryIds={module.categories?.map((c: any) => c.id)}
                    />
                );
            }

            if (module.type === 'featured_products') {
                return (
                    <ProductSection 
                        key={module.id} 
                        title={module.name} 
                        type="featured"
                        categoryIds={module.categories?.map((c: any) => c.id)}
                    />
                );
            }

            if (module.type === 'new_arrivals') {
                return (
                    <ProductSection 
                        key={module.id} 
                        title={module.name} 
                        type="new_arrivals"
                        categoryIds={module.categories?.map((c: any) => c.id)}
                    />
                );
            }

            return null;
        })}
      </div>
    </>
  );
}
