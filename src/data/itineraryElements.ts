export interface ItineraryHotel {
  id: string;
  name: string;
  location: string;
  category: string;
  description: string;
  image: string;
  stars?: number;
}

export interface ItineraryActivity {
  id: string;
  title: string;
  location: string;
  category: string;
  duration: string;
  description: string;
  image: string;
}

export interface ItineraryVehicle {
  id: string;
  name: string;
  capacityPax: number;
  capacityLuggage: number;
  category: string;
  features: string[];
  description: string;
  image: string;
}

export interface ItineraryService {
  id: string;
  name: string;
  type: "transfer" | "tour" | "vip" | "service";
  description: string;
}

export interface DayTemplate {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  suggestedHotelId?: string;
  suggestedActivityIds?: string[];
  suggestedServiceId?: string;
}

export interface CustomItineraryData {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "saved" | "submitted";
  referenceCode?: string;
  title: string;
  guest: {
    name: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  durationDays: number;
  durationNights: number;
  startDate?: string;
  endDate?: string;
  travellers: {
    adults: number;
    children: number;
  };
  selectedVehicleId: string;
  selectedServices: string[];
  days: {
    dayNumber: number;
    title: string;
    hotelId?: string;
    activityIds: string[];
    serviceId?: string;
    notes?: string;
  }[];
}

export const defaultHotels: ItineraryHotel[] = [
  {
    id: "hotel-mandapa-ritz",
    name: "Mandapa, a Ritz-Carlton Reserve",
    location: "Ubud, Bali",
    category: "RIVERFRONT SANCTUARY",
    description: "An intimate sanctuary along the Ayung River, offering secluded pool villas and butler service.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    stars: 5,
  },
  {
    id: "hotel-bvlgari-resort",
    name: "Bvlgari Resort Bali",
    location: "Uluwatu, Bali",
    category: "CLIFFSIDE RESORT",
    description: "Perched 150 meters above the Indian Ocean, combining dramatic clifftop architecture with unmatched luxury.",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
    stars: 5,
  },
  {
    id: "hotel-four-seasons-sayayan",
    name: "Four Seasons Resort at Sayan",
    location: "Sayan, Ubud",
    category: "VALLEY HIDEAWAY",
    description: "A suspended lotus pond entrance leading into an iconic river valley sanctuary surrounded by sacred greenery.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    stars: 5,
  },
  {
    id: "hotel-alila-villas-uluwatu",
    name: "Alila Villas Uluwatu",
    location: "Uluwatu, Bali",
    category: "MODERN MINIMALIST VILLA",
    description: "Eco-luxury ocean cliff villas with iconic sunset cabanas and private infinity pools.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    stars: 5,
  },
  {
    id: "hotel-the-legian-seminyak",
    name: "The Legian Seminyak",
    location: "Seminyak Beach, Bali",
    category: "BEACHFRONT RETREAT",
    description: "Timeless beachfront elegance with three-tiered infinity pools overlooking golden sunset sands.",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80",
    stars: 5,
  },
  {
    id: "hotel-amankila-manggis",
    name: "Amankila East Coast Haven",
    location: "Manggis, East Bali",
    category: "EXCLUSIVE CLIFF HAVEN",
    description: "Quiet coastal hillside retreat with three-tier cascading pools against the backdrop of Mount Agung.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    stars: 5,
  },
];

export const defaultActivities: ItineraryActivity[] = [
  {
    id: "act-ubud-cultural-art",
    title: "Private Ubud Royal Heritage & Artisan Workshops",
    location: "Ubud",
    category: "CULTURE & HERITAGE",
    duration: "4 - 5 Hours",
    description: "Private audience with local master silversmiths, batik artisans, and exclusive access to historic royal compounds.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "act-batur-sunrise-jeep",
    title: "Mount Batur Sunrise 4WD Jeep & Gourmet Lake Breakfast",
    location: "Kintamani",
    category: "NATURE & ADVENTURE",
    duration: "6 Hours",
    description: "Witness dawn across volcanic black lava fields from a private vintage 4WD, followed by an artisanal hillside breakfast.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "act-uluwatu-sunset-kecak",
    title: "Clifftop Sunset, VIP Kecak Fire Dance & Jimbaran Seafood",
    location: "Uluwatu & Jimbaran",
    category: "PERFORMANCE & CULINARY",
    duration: "5 Hours",
    description: "Reserved seating at the iconic ocean amphitheater as twilight falls, followed by beachfront candlelight seafood dining.",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "act-nusa-penida-yacht",
    title: "Private Yacht Charter to Manta Bay & Crystal Cove",
    location: "Nusa Penida & Lembongan",
    category: "OCEAN & MARINE",
    duration: "Full Day (8 Hours)",
    description: "Private cruising, guided manta ray snorkeling, private chef lunch aboard, and secluded beach anchorings.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "act-organic-cooking-class",
    title: "Farm-to-Table Balinese Cooking Masterclass",
    location: "Sidemen Valley",
    category: "CULINARY",
    duration: "4 Hours",
    description: "Forage fresh organic spices and ingredients in terraced hills before crafting ancestral heritage dishes.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "act-sound-healing-spa",
    title: "Sacred Sound Healing & Traditional Royal Herbal Spa",
    location: "Pyramids of Chi / Ubud",
    category: "WELLNESS & SPA",
    duration: "3 Hours",
    description: "Harmonizing gong vibrational therapy accompanied by a 90-minute traditional herbal boreh massage.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
  },
];

export const defaultVehicles: ItineraryVehicle[] = [
  {
    id: "veh-alphard",
    name: "Toyota Alphard / Vellfire Luxury VIP",
    capacityPax: 4,
    capacityLuggage: 4,
    category: "FIRST CLASS VIP",
    features: [
      "Plush Leather Ottoman Captain Seats",
      "Chilled Refreshment Box & Mineral Water",
      "High-speed Onboard Wi-Fi",
      "Uniformed English-speaking Chauffeur",
      "Cold Towels & Welcome Amenities",
    ],
    description: "The ultimate standard in executive road comfort for couples and intimate families desiring effortless luxury.",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "veh-innova-zenix",
    name: "Toyota Innova Zenix Hybrid Luxury",
    capacityPax: 4,
    capacityLuggage: 4,
    category: "PREMIUM HYBRID",
    features: [
      "Second Row Captain Seats",
      "Panoramic Moonroof",
      "Eco-Quiet Hybrid Drive",
      "Professional Chauffeur",
      "Mineral Water & Wi-Fi",
    ],
    description: "Quiet, smooth, and sustainable touring through mountain roads and coastal highways with modern captain seating.",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "veh-hiace-premio",
    name: "Toyota HiAce Premio Luxury VIP",
    capacityPax: 8,
    capacityLuggage: 8,
    category: "EXECUTIVE GROUP",
    features: [
      "Custom High-Roof VIP Cabin",
      "8 Individual Leather Reclining Seats",
      "Individual USB Charging & AC Vents",
      "Spacious Dedicated Luggage Bay",
      "Chauffeur & Refreshments",
    ],
    description: "Designed for families and private groups requiring generous head space, individual comfort, and substantial luggage room.",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "veh-sprinter",
    name: "Mercedes-Benz Sprinter Royal Edition",
    capacityPax: 12,
    capacityLuggage: 12,
    category: "ROYAL COACH",
    features: [
      "Aircraft-Style First Class Seating",
      "Built-in Smart TV & Sound System",
      "Mini Refrigerator & Beverage Station",
      "Privacy Tinted Windows",
      "Chauffeur & Concierge Escort",
    ],
    description: "The pinnacle of grand group touring, delivering club-class luxury for extended private delegations.",
    image: "https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=800&q=80",
  },
];

export const defaultServices: ItineraryService[] = [
  {
    id: "srv-transfer-in",
    name: "Airport Transfer IN (Arrival Meet & Greet)",
    type: "transfer",
    description: "Personalized terminal greeting, baggage assistance, cold towels, and seamless private transfer to your hotel.",
  },
  {
    id: "srv-transfer-out",
    name: "Airport Transfer OUT (Departure Drop-off)",
    type: "transfer",
    description: "Punctual hotel pick-up, luggage handling, and direct transfer to International/Domestic departure gates.",
  },
  {
    id: "srv-fullday-tour",
    name: "Full Day Private Chauffeur & Tour (10 Hours)",
    type: "tour",
    description: "Dedicated vehicle, fuel, parking, and English-speaking chauffeur for 10 hours flexible bespoke exploration.",
  },
  {
    id: "srv-halfday-tour",
    name: "Half Day Private Chauffeur & Tour (6 Hours)",
    type: "tour",
    description: "Dedicated vehicle and chauffeur for up to 6 hours for localized excursions, dining, or shopping.",
  },
  {
    id: "srv-fast-track",
    name: "VIP Airport Fast Track & Immigration Assistance",
    type: "vip",
    description: "Expedited immigration clearance, priority baggage retrieval, and airport lounge access upon arrival/departure.",
  },
  {
    id: "srv-private-guide",
    name: "Licensed Expert Tour Guide / Cultural Specialist",
    type: "service",
    description: "A knowledgeable local historian and cultural expert accompanying your daily tours for deep storytelling.",
  },
  {
    id: "srv-luggage-van",
    name: "Dedicated Luggage Support Van",
    type: "service",
    description: "Separate support vehicle dedicated exclusively to extra luggage, golf bags, or shopping haul.",
  },
];

export const defaultDayTemplates: DayTemplate[] = [
  {
    id: "tpl-day-1",
    dayNumber: 1,
    title: "Arrival, VIP Airport Welcome & Coastal Settle-in",
    description: "Arrive in paradise. Private chauffeur transfer from airport to your chosen luxury resort with sunset welcome drinks.",
    suggestedHotelId: "hotel-the-legian-seminyak",
    suggestedServiceId: "srv-transfer-in",
  },
  {
    id: "tpl-day-2",
    dayNumber: 2,
    title: "Cultural Heart of Ubud & Artisan Exploration",
    description: "Journey into the verdant highlands. Private workshop visits, lush rice terraces, and riverfront rejuvenation.",
    suggestedHotelId: "hotel-mandapa-ritz",
    suggestedActivityIds: ["act-ubud-cultural-art"],
    suggestedServiceId: "srv-fullday-tour",
  },
  {
    id: "tpl-day-3",
    dayNumber: 3,
    title: "Volcanic Dawn, Organic Farms & Sacred Waters",
    description: "Early sunrise vista across Mount Batur followed by a farm-to-table culinary feast and afternoon spa.",
    suggestedHotelId: "hotel-four-seasons-sayayan",
    suggestedActivityIds: ["act-batur-sunrise-jeep", "act-organic-cooking-class"],
    suggestedServiceId: "srv-fullday-tour",
  },
  {
    id: "tpl-day-4",
    dayNumber: 4,
    title: "Southern Ocean Cliffs & Sunset Kecak Fire Dance",
    description: "Check into ocean cliffs. Leisure afternoon by the infinity pool, followed by clifftop Kecak performance and seaside dinner.",
    suggestedHotelId: "hotel-bvlgari-resort",
    suggestedActivityIds: ["act-uluwatu-sunset-kecak"],
    suggestedServiceId: "srv-fullday-tour",
  },
  {
    id: "tpl-day-5",
    dayNumber: 5,
    title: "Private Yacht Charter to Secret Coves",
    description: "Sail across azure straits to Nusa Penida, snorkeling alongside gentle manta rays and relaxing on isolated white sands.",
    suggestedHotelId: "hotel-alila-villas-uluwatu",
    suggestedActivityIds: ["act-nusa-penida-yacht"],
    suggestedServiceId: "srv-fullday-tour",
  },
  {
    id: "tpl-day-6",
    dayNumber: 6,
    title: "Holistic Wellness & Leisure Shopping",
    description: "A restorative day of traditional herbal therapies, quiet reading by the sea, and visiting boutique design houses.",
    suggestedHotelId: "hotel-bvlgari-resort",
    suggestedActivityIds: ["act-sound-healing-spa"],
    suggestedServiceId: "srv-halfday-tour",
  },
  {
    id: "tpl-day-7",
    dayNumber: 7,
    title: "Last Morning In Paradise & Seamless Departure",
    description: "Slow gourmet breakfast with ocean breeze, final souvenir collections, and private chauffeur transfer to airport.",
    suggestedHotelId: "hotel-bvlgari-resort",
    suggestedServiceId: "srv-transfer-out",
  },
];

