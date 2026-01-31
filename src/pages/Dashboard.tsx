import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import {
  Package,
  TrendingUp,
  MessageSquare,
  Plus,
  Factory,
  Truck,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ShoppingBag,
  Activity,
  Download,
  FileText
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LogisticsMap from "@/components/dashboard/LogisticsMap";
import WeightReconciliationWorker from "@/components/dashboard/WeightReconciliationWorker";

const userTypeIcons = {
  generator: Factory,
  middleman: Truck,
  recycler: RefreshCw,
};

const userTypeLabels = {
  generator: "Waste Generator",
  middleman: "Middleman",
  recycler: "Recycler",
};

const RecyclerDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">Mission Control</h1>
              <p className="text-muted-foreground">Manage logistics, verify incoming stock, and audit compliance.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export Manifests
              </Button>
            </div>
          </div>

          <Tabs defaultValue="logistics" className="space-y-6">
            <TabsList className="bg-muted/50 p-1 rounded-xl h-auto flex flex-wrap gap-2 justify-start w-full md:w-auto">
              <TabsTrigger value="logistics" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Live Logistics
              </TabsTrigger>
              <TabsTrigger value="weights" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Weight Ops
              </TabsTrigger>
              <TabsTrigger value="audit" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Audit Log
              </TabsTrigger>
              <TabsTrigger value="compliance" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Compliance
              </TabsTrigger>
            </TabsList>

            {/* 1. Live Logistics Tab */}
            <TabsContent value="logistics" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Map takes up 2 columns */}
                <div className="md:col-span-2">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Real-Time Tracking
                  </h3>
                  <LogisticsMap />
                </div>

                {/* Schedule / Queue Panel */}
                <div className="md:col-span-1 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Incoming Queue</CardTitle>
                      <CardDescription>Scheduled arrivals for today</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { time: "14:30", id: "TRK-882", status: "In Transit", eta: "15 min" },
                        { time: "16:00", id: "TRK-901", status: "Scheduled", eta: "--" },
                        { time: "17:15", id: "TRK-102", status: "Scheduled", eta: "--" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                          <div>
                            <p className="font-bold font-mono">{item.time}</p>
                            <p className="text-xs text-muted-foreground">{item.id}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${item.status === 'In Transit' ? 'text-blue-500' : ''}`}>
                              {item.status}
                            </p>
                            <p className="text-xs text-muted-foreground">ETA: {item.eta}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* 2. Weight Ops Tab */}
            <TabsContent value="weights" className="animate-fade-in">
              <WeightReconciliationWorker />
            </TabsContent>

            {/* 3. Audit Log Tab (Placeholder) */}
            <TabsContent value="audit" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Verified Transaction Ledger</CardTitle>
                  <CardDescription>Immutable record of all purchased materials.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <FileText className="w-16 h-16 mb-4 opacity-20" />
                    <p>Select a date range to view audit logs.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 4. Compliance Tab (Placeholder) */}
            <TabsContent value="compliance" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Carbon Impact Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <span className="text-5xl font-bold text-green-600 block mb-2">1,240</span>
                      <span className="text-muted-foreground">kg CO2 Saved This Month</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Digital Manifests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Download Monthly Compliance Pack (PDF)
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

const MiddlemanDashboard = () => {
  const [isTripActive, setIsTripActive] = useState(false);
  const [pickupWeight, setPickupWeight] = useState("");
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      const { data } = await supabase
        .from("waste_listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(6);

      if (data) setListings(data);
    };
    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">Operations Console</h1>
              <p className="text-muted-foreground">Manage your fleet, negotiate deals, and track deliveries.</p>
            </div>
          </div>

          <Tabs defaultValue="marketplace" className="space-y-6">
            <TabsList className="bg-muted/50 p-1 rounded-xl h-auto flex flex-wrap gap-2 justify-start w-full md:w-auto">
              <TabsTrigger value="marketplace" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Marketplace Feed
              </TabsTrigger>
              <TabsTrigger value="trips" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                My Trips
              </TabsTrigger>
              <TabsTrigger value="earnings" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Earnings
              </TabsTrigger>
            </TabsList>

            {/* 1. Marketplace Feed Tab */}
            <TabsContent value="marketplace" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No verified listings available in your area right now.</p>
                  </div>
                ) : (
                  listings.map((listing: any) => (
                    <Card key={listing.id} className="overflow-hidden">
                      <div className="h-40 bg-muted flex items-center justify-center relative">
                        {(() => {
                          // Demo Image Overrides for Hackathon
                          const titleLower = listing.title?.toLowerCase() || "";
                          let displayImage = listing.images && listing.images[0];

                          if (titleLower.includes("industrial") || titleLower.includes("plastic")) {
                            displayImage = "https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=2574&auto=format&fit=crop";
                          } else if (titleLower.includes("bottle")) {
                            displayImage = "https://images.unsplash.com/photo-1605600659908-0ef719419d41?q=80&w=2487&auto=format&fit=crop";
                          }

                          return displayImage ? (
                            <img src={displayImage} alt={listing.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                          ) : (
                            <Package className="w-12 h-12 text-muted-foreground/50" />
                          );
                        })()}
                        <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium shadow-sm">Verified</span>
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg truncate">{listing.title}</CardTitle>
                        </div>
                        <CardDescription>{listing.quantity} {listing.unit} • {listing.address}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Asking Price:</span>
                            <span className="font-medium font-mono">${listing.price?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">AI Suggested:</span>
                            <span className="font-medium text-blue-600 font-mono">
                              ${Math.floor(Number(listing.price || 0) * 0.9)?.toLocaleString()} - ${Number(listing.price || 0)?.toLocaleString()}
                            </span>
                          </div>
                          <div className="pt-2">
                            <Button className="w-full gap-2" asChild>
                              <Link to={`/listings/${listing.id}`}>
                                <MessageSquare className="w-4 h-4" />
                                Negotiate Offer
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* 2. My Trips Tab */}
            <TabsContent value="trips" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trip Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      Active Trip Controls
                    </CardTitle>
                    <CardDescription>Manage your current pickup and delivery status.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                      <div>
                        <h4 className="font-medium">Live GPS Tracking</h4>
                        <p className="text-xs text-muted-foreground">Share live location with Recycler</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${isTripActive ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {isTripActive ? 'Broadcasting' : 'Offline'}
                        </span>
                        <Button
                          size="sm"
                          variant={isTripActive ? "destructive" : "default"}
                          onClick={() => setIsTripActive(!isTripActive)}
                        >
                          {isTripActive ? "Stop Trip" : "Start Trip"}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pickup Weight Verification (kg)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Enter scale reading"
                          value={pickupWeight}
                          onChange={(e) => setPickupWeight(e.target.value)}
                        />
                        <Button variant="secondary">Verify</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Compare against AI estimate (45kg)</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-accent" />
                      Delivery Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/50">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">NEXT UP</span>
                          <span className="text-xs text-muted-foreground">14:00 Today</span>
                        </div>
                        <h4 className="font-medium">Recycler Hub A - Dropoff</h4>
                        <p className="text-xs text-muted-foreground mt-1">Expected Payout: $125,000</p>
                      </div>

                      <div className="p-3 bg-muted/30 rounded-lg border border-border opacity-60">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-muted-foreground/70 bg-muted px-2 py-0.5 rounded-full">PENDING</span>
                          <span className="text-xs text-muted-foreground">16:30 Today</span>
                        </div>
                        <h4 className="font-medium">Pickup at Lekki Phase 1</h4>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">Sync Calendar</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 3. Earnings Tab */}
            <TabsContent value="earnings" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Real-Time Profit Tracker</CardTitle>
                  <CardDescription>Net profit after user payments and estimated fuel costs.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                      <p className="text-xs text-muted-foreground mb-1">Recycler Payouts</p>
                      <p className="text-2xl font-bold text-green-600">+$450,000</p>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                      <p className="text-xs text-muted-foreground mb-1">Cost of Goods (User)</p>
                      <p className="text-2xl font-bold text-red-500">-$280,000</p>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                      <p className="text-xs text-muted-foreground mb-1">Est. Fuel & Ops</p>
                      <p className="text-2xl font-bold text-orange-500">-$45,000</p>
                    </div>
                  </div>
                  <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-muted-foreground mb-2">NET PROFIT (Current Run)</p>
                    <p className="text-5xl font-black text-primary">$125,000</p>
                    <div className="mt-4 flex gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12% vs last week
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const [listingsCount, setListingsCount] = useState(0);
  const [pendingOffersCount, setPendingOffersCount] = useState(0);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    const [listingsRes, receivedOffersRes, sentOffersRes, activeOrdersRes, completedOrdersRes, revenueRes] = await Promise.all([
      supabase
        .from("waste_listings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id)
        .eq("status", "active"),
      supabase
        .from("offers")
        .select("*", { count: "exact", head: true })
        .eq("seller_id", user?.id)
        .eq("status", "pending"),
      supabase
        .from("offers")
        .select("*", { count: "exact", head: true })
        .eq("buyer_id", user?.id)
        .in("status", ["pending", "countered"]),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`)
        .in("status", ["pending_pickup", "pickup_scheduled", "in_transit", "delivered"]),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`)
        .eq("status", "completed"),
      supabase
        .from("orders")
        .select("amount")
        .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`)
        .eq("status", "completed")
    ]);

    setListingsCount(listingsRes.count || 0);
    setPendingOffersCount((receivedOffersRes.count || 0) + (sentOffersRes.count || 0));
    setActiveOrdersCount(activeOrdersRes.count || 0);
    setCompletedOrdersCount(completedOrdersRes.count || 0);

    const revenue = (revenueRes.data || []).reduce((sum, o) => sum + Number(o.amount), 0);
    setTotalRevenue(revenue);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const UserIcon = profile?.user_type ? userTypeIcons[profile.user_type] : Factory;

  // CONDITIONAL RENDER: If user is a Recycler, show the new Mission Control Dashboard
  if (profile?.user_type === 'recycler') {
    return <RecyclerDashboard />;
  }

  // CONDITIONAL RENDER: If user is a Middleman, show the Operations Console
  if (profile?.user_type === 'middleman') {
    return <MiddlemanDashboard />;
  }

  // If profile is not loaded yet (but not loading auth), show a spinner to prevent flashing Generator view
  // If profile is not loaded, we fall through to the default Waste Generator Dashboard
  // This prevents infinite loading for legacy accounts that might not have a profile record

  // DEFAULT: Waste Generator Dashboard
  // This is now explicitly the fallback only if profile exists and type is not the others
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-xl bg-hero-gradient flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Welcome, {profile?.full_name || "User"}!
                </h1>
                <p className="text-muted-foreground">
                  {profile?.user_type ? userTypeLabels[profile.user_type] : "Member"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Link to="/my-listings" className="bg-card rounded-2xl p-6 shadow-soft border border-border hover:shadow-elevated transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-8 h-8 text-primary" />
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <p className="font-display text-3xl font-bold text-foreground">{listingsCount}</p>
              <p className="text-sm text-muted-foreground">Active Listings</p>
            </Link>

            <Link to="/analytics" className="bg-card rounded-2xl p-6 shadow-soft border border-border hover:shadow-elevated transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-accent" />
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  This month
                </span>
              </div>
              <p className="font-display text-3xl font-bold text-foreground">${totalRevenue?.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </Link>

            <Link to="/my-offers" className="bg-card rounded-2xl p-6 shadow-soft border border-border hover:shadow-elevated transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <MessageSquare className="w-8 h-8 text-primary" />
                {pendingOffersCount > 0 && (
                  <span className="text-xs text-primary-foreground bg-primary px-2 py-1 rounded-full">
                    {pendingOffersCount} pending
                  </span>
                )}
              </div>
              <p className="font-display text-3xl font-bold text-foreground">{pendingOffersCount}</p>
              <p className="text-sm text-muted-foreground">Active Offers</p>
            </Link>

            <Link to="/my-orders" className="bg-card rounded-2xl p-6 shadow-soft border border-border hover:shadow-elevated transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <ShoppingBag className="w-8 h-8 text-primary" />
                {activeOrdersCount > 0 && (
                  <span className="text-xs text-primary-foreground bg-primary px-2 py-1 rounded-full">
                    {activeOrdersCount} active
                  </span>
                )}
              </div>
              <p className="font-display text-3xl font-bold text-foreground">{activeOrdersCount}</p>
              <p className="text-sm text-muted-foreground">Active Orders</p>
            </Link>

            <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-accent" />
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  Completed
                </span>
              </div>
              <p className="font-display text-3xl font-bold text-foreground">{completedOrdersCount}</p>
              <p className="text-sm text-muted-foreground">Transactions</p>
            </div>
          </div>

          {/* Quick Actions + Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Listing Card */}
            <div className="bg-hero-gradient rounded-3xl p-8 text-primary-foreground">
              <h3 className="font-display text-2xl font-bold mb-2">
                {profile?.user_type === "generator"
                  ? "List Your Waste"
                  : profile?.user_type === "recycler"
                    ? "Browse Materials"
                    : "Find Opportunities"}
              </h3>
              <p className="text-white/80 mb-6">
                {profile?.user_type === "generator"
                  ? "Post your waste materials and start receiving offers from interested buyers."
                  : profile?.user_type === "recycler"
                    ? "Browse available waste materials and make competitive offers."
                    : "Connect waste generators with recyclers and earn margins."}
              </p>
              <Button
                className="bg-white text-primary hover:bg-white/90"
                size="lg"
                asChild
              >
                <Link to={profile?.user_type === "generator" ? "/create-listing" : "/browse"}>
                  <Plus className="w-4 h-4 mr-2" />
                  {profile?.user_type === "generator" ? "Create Listing" : "Browse Listings"}
                </Link>
              </Button>
            </div>

            {/* Recent Activity Feed */}
            <RecentActivityFeed />

            {/* Profile Completion Card */}
            <div className="bg-card rounded-3xl p-8 shadow-soft border border-border">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Complete Your Profile
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Add more details to build trust with other traders.
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg">
                  <span className="text-sm text-foreground">Add company name</span>
                  <span className="text-xs text-muted-foreground">+20%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg">
                  <span className="text-sm text-foreground">Add phone number</span>
                  <span className="text-xs text-muted-foreground">+15%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg">
                  <span className="text-sm text-foreground">Add location</span>
                  <span className="text-xs text-muted-foreground">+15%</span>
                </div>
              </div>

              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to="/profile">
                  Edit Profile
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
