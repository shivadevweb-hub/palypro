
export interface Toy {
  id: string;
  name: string;
  image: string;
  ageRange: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  brand: string;
  available: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  toyCount: number;
  features: string[];
}

export const TOYS: Toy[] = [
  {
    id: "1",
    name: "Classic Wooden Train Set",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800",
    ageRange: "3-5 Years",
    category: "Educational",
    shortDescription: "A durable 50-piece wooden train set with tracks, engines, and scenery.",
    fullDescription: "Encourage creativity and fine motor skills with this classic set. Includes 20 track pieces, bridge, tunnel, and multiple magnetic train cars. Made from sustainably sourced beech wood.",
    brand: "EcoPlay",
    available: true
  },
  {
    id: "2",
    name: "Smart Coding Robot",
    image: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=800",
    ageRange: "6-10 Years",
    category: "STEM",
    shortDescription: "Learn basic programming logic through fun offline play with this friendly robot.",
    fullDescription: "Bot-Z is the perfect introduction to coding. Screen-free interaction allows children to program movements using colorful cards. Teaches sequencing, logic, and problem-solving.",
    brand: "TechKids",
    available: true
  },
  {
    id: "3",
    name: "Architect Master Blocks",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=800",
    ageRange: "4-12 Years",
    category: "Building",
    shortDescription: "100-piece magnetic building set for endless architectural possibilities.",
    fullDescription: "Vibrant, translucent magnetic tiles that allow children to build 2D and 3D shapes. Excellent for understanding geometry, light, and construction basics. High-quality food-grade ABS plastic.",
    brand: "MagnaBuild",
    available: true
  },
  {
    id: "4",
    name: "Panda Art Studio Kit",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    ageRange: "5+ Years",
    category: "Creative",
    shortDescription: "Complete watercolor and sketching set for the little artist.",
    fullDescription: "A comprehensive art kit featuring 24 watercolor pans, 12 professional pencils, brushes, and a sketchpad. All materials are non-toxic and washable, perfect for messy creativity.",
    brand: "LittlePanda",
    available: true
  },
  {
    id: "5",
    name: "Safari Explorer Binoculars",
    image: "https://images.unsplash.com/photo-1621643922245-c4033010b93d?auto=format&fit=crop&q=80&w=800",
    ageRange: "3-8 Years",
    category: "Outdoor",
    shortDescription: "Rugged, child-safe binoculars with 4x magnification for outdoor adventures.",
    fullDescription: "Shockproof binoculars designed for small hands. Features soft rubber eyepieces and easy-focusing. Perfect for bird watching, camping, and backyard expeditions.",
    brand: "AdventureGear",
    available: true
  },
  {
    id: "6",
    name: "Space Rover Mechanics",
    image: "https://images.unsplash.com/photo-1533550822359-fb3a0c647a74?auto=format&fit=crop&q=80&w=800",
    ageRange: "8-14 Years",
    category: "STEM",
    shortDescription: "Assemble your own solar-powered space rover with real moving parts.",
    fullDescription: "Advanced building kit that explores solar energy and mechanical engineering. Build 5 different models that move using the power of the sun. Includes detailed assembly instructions.",
    brand: "SolarTech",
    available: true
  }
];

export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic Explorer",
    price: 999,
    toyCount: 3,
    features: [
      "3 toys per month",
      "Standard cleaning",
      "Free delivery & pickup",
      "Cancel anytime"
    ]
  },
  {
    id: "standard",
    name: "Smart Parent",
    price: 1999,
    toyCount: 5,
    features: [
      "5 toys per month",
      "Advanced sanitization",
      "Priority delivery",
      "Curated age-based recommendations",
      "Swap monthly"
    ]
  },
  {
    id: "premium",
    name: "Play Master",
    price: 2999,
    toyCount: 7,
    features: [
      "7 toys per month",
      "The 'No Questions' damage waiver",
      "Next-day delivery",
      "Personal play consultant",
      "Early access to new arrivals"
    ]
  }
];
