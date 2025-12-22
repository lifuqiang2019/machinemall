export interface Category {
    id: string;
    name: string;
    icon?: string;
    sections?: {
        title: string;
        items: string[];
    }[];
}

export interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    category: string;
    status?: string;
    images?: string[];
    description?: string;
    summary?: string[];
    specs?: {
        label: string;
        value: string;
    }[];
    shipping?: {
        leadTime: string;
        moq: string;
        ability: string;
        stock: string;
        port: string;
    };
}

export const NAV_ITEMS = [
    "Home",
    "Used Equipment",
    "On Sale",
    "RFQ",
    "News",
    "About XCMG",
];

export const CATEGORIES: Category[] = [
    {
        id: "34",
        name: "Engineering & Construction Machinery",
        sections: [
            {
                title: "Engineering & Construction Crane",
                items: ["Truck Crane", "Crawler Crane", "Truck Mounted Crane", "Tower Crane", "All Terrain Crane", "Rough Terrain Crane", "Gantry Crane"]
            },
            {
                title: "Earth-Moving Machinery",
                items: ["Crawler Excavator", "Wheel Excavator", "Wheel Loader", "Skid Steer Loader", "Backhoe Loader", "Bulldozer"]
            },
            {
                title: "Road Construction & Maintenance Machinery",
                items: ["Road Roller", "Motor Grader", "Milling Machine", "Paver", "Soil Stabilizer", "Asphalt Mixing Plant", "Cold Recycler", "Asphalt Distributor", "Synchronous Chip Sealer"]
            }
        ]
    },
    {
        id: "38",
        name: "Energy & Mining Equipment",
        sections: [
            {
                title: "Mining Equipment",
                items: ["Mining Truck", "Mining Excavator", "Drilling Rig", "Crushing Plant"]
            }
        ]
    },
    {
        id: "35",
        name: "Agriculture & Forestry Machinery",
        sections: [
            {
                title: "Agriculture",
                items: ["Tractor", "Harvester", "Planter"]
            }
        ]
    },
    { id: "45", name: "Sanitation Machinery", sections: [] },
    { id: "1044", name: "Storage & Logistics Equipment", sections: [] },
];

export const FEATURED_PRODUCTS: Product[] = [
    {
        id: "p1",
        name: "XCMG XE215DA Crawler Excavator",
        price: "Inquiry",
        image: "https://placehold.co/400x300?text=Excavator+XE215DA",
        category: "Engineering & Construction Machinery",
    },
    {
        id: "p2",
        name: "XCMG QY25K5C Truck Crane",
        price: "Inquiry",
        image: "https://placehold.co/400x300?text=Crane+QY25K5C",
        category: "Engineering & Construction Machinery",
    },
    {
        id: "p3",
        name: "XCMG LW500FN Wheel Loader",
        price: "Inquiry",
        image: "https://placehold.co/400x300?text=Loader+LW500FN",
        category: "Engineering & Construction Machinery",
    },
    {
        id: "p4",
        name: "XCMG GR1803 Motor Grader",
        price: "Inquiry",
        image: "https://placehold.co/400x300?text=Grader+GR1803",
        category: "Engineering & Construction Machinery",
    },
    {
        id: "p5",
        name: "XCMG HANVAN G7 Heavy Truck",
        price: "Inquiry",
        image: "https://placehold.co/400x300?text=Truck+G7",
        category: "Energy & Mining Equipment",
    },
    {
        id: "p6",
        name: "XCMG XC958 Wheel Loader",
        price: "Inquiry",
        image: "https://placehold.co/400x300?text=Loader+XC958",
        category: "Engineering & Construction Machinery",
    },
    {
        id: "p7",
        name: "XCMG XE35U Compact Excavator",
        price: "Inquiry",
        image: "https://placehold.co/400x300?text=Excavator+XE35U",
        category: "Engineering & Construction Machinery",
    },
    {
        id: "p8",
        name: "XCMG XCT25L5 Truck Crane",
        price: "Inquiry",
        image: "https://placehold.co/400x300?text=Crane+XCT25L5",
        category: "Engineering & Construction Machinery",
    },
];

export const CATEGORY_BAR_ITEMS = [
    { name: "Scissor Lift", image: "https://placehold.co/100x100?text=Scissor+Lift" },
    { name: "Bulldozer", image: "https://placehold.co/100x100?text=Bulldozer" },
    { name: "Excavator", image: "https://placehold.co/100x100?text=Excavator" },
    { name: "Motor Grader", image: "https://placehold.co/100x100?text=Motor+Grader" },
    { name: "Skid Steer Loader", image: "https://placehold.co/100x100?text=Skid+Steer" },
    { name: "Truck Crane", image: "https://placehold.co/100x100?text=Truck+Crane" },
    { name: "Wheel loader", image: "https://placehold.co/100x100?text=Wheel+loader" },
];

export const PRODUCT_DETAILS: Record<string, Product> = {
    "5678": {
        id: "5678",
        name: "XCMG official 7m height electric mobile scissor lift GTJZ0607 Aerial Work Platform",
        price: "Inquiry for Price",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop",
        category: "Aerial Work Platforms",
        status: "New",
        images: [
            "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1000&auto=format&fit=crop"
        ],
        description: "The GTJZ0607 electric scissor lift is a high-performance aerial work platform designed for efficiency and safety. Featuring zero-emission electric drive, it's perfect for indoor use in warehouses, office buildings, and shopping malls. Its compact design allows for easy navigation in tight spaces.",
        summary: [
            "Working Height: 7.8m",
            "Platform Capacity: 230kg",
            "Electric Drive System",
            "Max Gradeability: 25%",
            "Compact Design: 1882*760*1771mm"
        ],
        specs: [
            { label: "Weight", value: "1490kg" },
            { label: "Overall Dimension", value: "1882*760*1771mm" },
            { label: "Max Lifting Height", value: "7.8m" },
            { label: "Rated Loading Capacity", value: "230kg" },
            { label: "Power", value: "3kw" },
            { label: "Lift Drive", value: "Hydraulic" },
            { label: "Model Number", value: "GTJZ0607" },
            { label: "Brand Name", value: "XCMG" },
            { label: "Certification", value: "CE/ISO" }
        ],
        shipping: {
            leadTime: "7 days for ready goods",
            moq: "1 Piece",
            ability: "10,000 Sets per Month",
            stock: "Over 5000 units",
            port: "Any Port In China"
        }
    }
};
