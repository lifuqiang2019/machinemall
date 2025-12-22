export interface Category {
    id: string;
    name: string;
    icon?: string;
    subcategories?: string[];
}

export interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    category: string;
    status?: string;
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
        subcategories: ["Excavators", "Cranes", "Loaders", "Road Machinery"],
    },
    {
        id: "38",
        name: "Energy & Mining Equipment",
        subcategories: ["Mining Trucks", "Drilling Rigs"],
    },
    {
        id: "35",
        name: "Agriculture & Forestry Machinery",
        subcategories: ["Tractors", "Harvesters"],
    },
    {
        id: "45",
        name: "Sanitation Machinery",
        subcategories: ["Garbage Trucks", "Sweepers"],
    },
    {
        id: "1044",
        name: "Storage & Logistics Equipment",
        subcategories: ["Forklifts", "Pallet Trucks"],
    },
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
