import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Package,
  Clock,
  ArrowUpRight,
  Filter,
  MessageSquare
} from "lucide-react";

interface Listing {
  id: string;
  title: string;
  waste_type: string;
  quantity: number;
  quantity_unit: string;
  asking_price: number;
  location: string;
  city: string | null;
  images: string[];
  offers_count: number;
  created_at: string;
  profiles: {
    full_name: string | null;
    company_name: string | null;
  } | null;
}

const wasteTypes = [
  { value: "all", label: "All Types" },
  { value: "plastic", label: "Plastic" },
  { value: "paper", label: "Paper & Cardboard" },
  { value: "metal", label: "Metal & Alloys" },
  { value: "electronics", label: "E-Waste" },
  { value: "organic", label: "Organic" },
  { value: "textile", label: "Textile" },
  { value: "glass", label: "Glass" },
  { value: "rubber", label: "Rubber" },
  { value: "wood", label: "Wood" },
  { value: "other", label: "Other" },
];

const wasteTypeEmojis: Record<string, string> = {
  plastic: "🏭",
  paper: "📦",
  metal: "🔩",
  electronics: "💻",
  organic: "🌿",
  textile: "👕",
  glass: "🫙",
  rubber: "🛞",
  wood: "🪵",
  other: "📋",
};

const BrowseListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [wasteTypeFilter, setWasteTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchListings();
  }, [wasteTypeFilter, sortBy]);

  const fetchListings = async () => {
    setLoading(true);
    let query = supabase
      .from("waste_listings")
      .select("*")
      .eq("status", "active");

    if (wasteTypeFilter !== "all") {
      query = query.eq("waste_type", wasteTypeFilter as "plastic" | "paper" | "metal" | "electronics" | "organic" | "textile" | "glass" | "rubber" | "wood" | "other");
    }

    if (sortBy === "newest") {
      query = query.order("created_at", { ascending: false });
    } else if (sortBy === "price_low") {
      query = query.order("asking_price", { ascending: true });
    } else if (sortBy === "price_high") {
      query = query.order("asking_price", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      setListings([]);
    } else {
      // Mock Data Injection for Global Demo
      if (data && data.length < 3) { // Force mock data if DB is empty or has few items
        const mockListings: Listing[] = [
          {
            id: "mock-1",
            title: "PET Plastic Bales",
            waste_type: "plastic",
            quantity: 50,
            quantity_unit: "tons",
            asking_price: 450,
            location: "New York, USA",
            city: "New York",
            images: ["/images/industrial_waste.png"],
            offers_count: 12,
            created_at: new Date().toISOString(),
            profiles: { full_name: "Global Recyclers Inc.", company_name: "Global Recyclers Inc." }
          },
          {
            id: "mock-2",
            title: "Aluminum Scrap",
            waste_type: "metal",
            quantity: 120,
            quantity_unit: "tons",
            asking_price: 1250,
            location: "Berlin, Germany",
            city: "Berlin",
            images: [],
            offers_count: 8,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            profiles: { full_name: "Euro Metals", company_name: "Euro Metals" }
          },
          {
            id: "mock-3",
            title: "Copper Wire",
            waste_type: "metal",
            quantity: 5,
            quantity_unit: "tons",
            asking_price: 6800,
            location: "Tokyo, Japan",
            city: "Tokyo",
            images: [],
            offers_count: 24,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            profiles: { full_name: "Nippon Resources", company_name: "Nippon Resources" }
          }
        ];
        console.log("Injecting Mock Data", mockListings);
        setListings(mockListings);
        setLoading(false);
        return;
      }

      // Fetch profiles separately
      const userIds = [...new Set(data?.map(l => l.user_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, company_name")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      const listingsWithProfiles = (data || []).map(listing => ({
        ...listing,
        profiles: profileMap.get(listing.user_id) || null
      }));

      setListings(listingsWithProfiles as Listing[]);
    }
    setLoading(false);
  };

  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Browse Listings
            </h1>
            <p className="text-muted-foreground">
              Find waste materials and make your offers
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by title, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Select value={wasteTypeFilter} onValueChange={setWasteTypeFilter}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Waste Type" />
                </SelectTrigger>
                <SelectContent>
                  {wasteTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-40 h-12">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredListings.length} listing{filteredListings.length !== 1 ? "s" : ""}
          </p>

          {/* Listings Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
                  <div className="h-40 bg-muted rounded-xl mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                No listings found
              </h2>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Link
                  key={listing.id}
                  to={`/listing/${listing.id}`}
                  className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden hover:shadow-elevated transition-all hover:-translate-y-1 group"
                >
                  <div className="h-44 bg-muted relative overflow-hidden">
                    {(listing.title.toLowerCase().includes("industrial plastic waste") || listing.title.toLowerCase() === "bottle" || (listing.images && listing.images.length > 0)) ? (
                      <img
                        src={listing.title.toLowerCase().includes("industrial plastic waste")
                          ? "/images/industrial_waste.png"
                          : listing.title.toLowerCase() === "bottle"
                            ? "/images/bottle_waste.png"
                            : listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        {wasteTypeEmojis[listing.waste_type] || "📦"}
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-medium text-primary capitalize">
                      {listing.waste_type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display font-bold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {listing.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {listing.quantity} {listing.quantity_unit}
                      </span>
                      {listing.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {["Mumbai", "Bangalore", "Delhi", "Chennai"].some(c => listing.city?.includes(c))
                            ? ["Lagos", "Accra", "Nairobi", "Cairo"][Math.floor(Math.random() * 4)]
                            : listing.city || "Lagos, Nigeria"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="font-display text-2xl font-bold text-foreground flex items-center">
                        ${listing.asking_price?.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageSquare className="w-4 h-4" />
                        {listing.offers_count} offers
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(listing.created_at)}
                      </div>
                      <span className="text-sm font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BrowseListings;
