export interface TravelItem {
  slug: string;
  category: string;
  title: string;
  description: string;
  image: string;
  location?: string;
  airportDriveTime?: string;
  nearbyHighlights?: string;
  facilities?: { image: string; description: string }[];
  duration?: string;
  price?: string;
  body: string[];
}

export const hotels: TravelItem[] = [
  {
    slug: "ocean-private-retreat",
    category: "BEACH RESORT",
    title: "Ocean Private Retreat",
    description:
      "A secluded sanctuary where the turquoise ocean meets untouched nature.",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=85",
    location: "Southeast Asia",
    body: [
      "Discover a slower rhythm of life in a private coastal sanctuary.",
      "Spend your days exploring the ocean, enjoying exceptional cuisine, and reconnecting with nature.",
    ],
  },
  {
    slug: "forest-wellness-escape",
    category: "WELLNESS",
    title: "Forest Wellness Escape",
    description:
      "An intimate hideaway surrounded by lush forest and mountain air.",
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1400&q=85",
    location: "Europe",
    body: [
      "Find a new sense of balance in a landscape shaped by forest and mountain.",
      "A thoughtful retreat for travellers seeking privacy, wellness, and connection.",
    ],
  },
  {
    slug: "island-slow-living",
    category: "PRIVATE ISLAND",
    title: "Island Slow Living",
    description:
      "Barefoot luxury, private beaches, and days shaped entirely around you.",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1400&q=85",
    location: "Indian Ocean",
    body: [
      "Let the natural rhythm of the island set the pace for your stay.",
      "Enjoy secluded shores, immersive experiences, and personalised hospitality.",
    ],
  },
];

export const journal: TravelItem[] = [
  {
    slug: "art-and-architecture",
    category: "CULTURE & DESIGN",
    title: "A Journey Through Art and Architecture",
    description:
      "Discover the cities, galleries, and historic spaces that inspire a new way of seeing the world.",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1400&q=85",
    body: [
      "Some journeys begin with a painting, a building, or a quiet street.",
      "Explore destinations through their art, architecture, and the people who bring them to life.",
    ],
  },
  {
    slug: "the-art-of-slow-travel",
    category: "TRAVEL NOTES",
    title: "The Art of Slow Travel",
    description:
      "Make room for unhurried mornings, meaningful encounters, and unexpected discoveries.",
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=85",
    body: [
      "Travelling slowly creates space to notice the details that make a place special.",
      "Stay longer, meet local makers, and allow the destination to reveal itself naturally.",
    ],
  },
  {
    slug: "slow-days-in-bali",
    category: "TRAVEL NOTES",
    title: "Slow Days in Bali",
    description:
      "Quiet mornings, emerald rice fields, hidden villages, and moments shaped by the island's natural rhythm.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=85",
    body: [
      "In Bali, the most memorable moments often happen away from the itinerary.",
      "Wake slowly, follow country lanes through the rice fields, and let each village reveal its own pace of life.",
    ],
  },
  {
    slug: "sacred-bali",
    category: "CULTURE & SPIRIT",
    title: "The Sacred Side of Bali",
    description:
      "Explore temple ceremonies, ancestral traditions, and the living spiritual customs that define the island.",
    image:
      "https://images.unsplash.com/photo-1555400038-63f5ba517a08?auto=format&fit=crop&w=1400&q=85",
    body: [
      "Bali's spiritual traditions are woven into everyday life, from dawn offerings to village ceremonies.",
      "Approach temples and rituals with care, curiosity, and respect for the communities who preserve them.",
    ],
  },
  {
    slug: "beyond-the-beaches",
    category: "ISLAND DISCOVERY",
    title: "Beyond Bali's Beaches",
    description:
      "Waterfalls, volcanic landscapes, mountain villages, and hidden paths far beyond the coastline.",
    image:
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=1400&q=85",
    body: [
      "Travel inland to discover a different side of Bali, shaped by misty mountains and fertile valleys.",
      "Thoughtful guides and village stays turn secluded landscapes into meaningful, responsible journeys.",
    ],
  },
  {
    slug: "a-balinese-table",
    category: "FOOD & FLAVOUR",
    title: "A Balinese Table",
    description:
      "Local markets, family kitchens, and island-grown ingredients reveal Bali through its flavours.",
    image:
      "https://images.unsplash.com/photo-1559305616-3f99cd43e353?auto=format&fit=crop&w=1400&q=85",
    body: [
      "A Balinese meal begins with ingredients, traditions, and stories shared across generations.",
      "Explore markets with local cooks and discover the depth behind dishes grounded in island produce and spice.",
    ],
  },
];

export const plans: TravelItem[] = [
  {
    slug: "islands-and-ocean",
    category: "SIGNATURE JOURNEY",
    title: "Islands & Ocean",
    description:
      "A tailor-made escape combining private island stays with unforgettable ocean adventures.",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=85",
    duration: "7 DAYS",
    price: "ON REQUEST",
    body: [
      "Begin with a few restorative days beside the ocean.",
      "Continue with private excursions, local cuisine, and experiences designed around your interests.",
    ],
  },
  {
    slug: "heritage-and-discovery",
    category: "CULTURE & HERITAGE",
    title: "Heritage & Discovery",
    description:
      "An immersive itinerary through historic cities, local traditions, and exceptional stays.",
    image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1400&q=85",
    duration: "10 DAYS",
    price: "ON REQUEST",
    body: [
      "Explore historic neighbourhoods with time to discover the stories behind them.",
      "Each stop combines carefully selected accommodation with distinctive local experiences.",
    ],
  },
];

export const offers: TravelItem[] = [
  {
    slug: "island-escape",
    category: "LIMITED OFFER",
    title: "A Private Island Escape",
    description:
      "Discover a considered collection of stays and experiences for your next island holiday.",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=85",
    body: [
      "Explore selected island stays for inspiration for your next journey.",
      "Availability, booking periods, and benefits must be confirmed with the property.",
    ],
  },
];