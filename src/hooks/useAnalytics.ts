import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { analyticsService } from "@/services/api";

export interface AnalyticsData {
  // Summary stats
  totalRevenue: number;
  totalTransactions: number;
  activeListings: number;
  pendingOffers: number;

  // Time series data
  revenueByPeriod: { period: string; revenue: number; transactions: number }[];
  listingsByPeriod: { period: string; count: number }[];
  offersByStatus: { status: string; count: number }[];
  ordersByStatus: { status: string; count: number }[];

  // Activity metrics
  topWasteTypes: { type: string; count: number; revenue: number }[];
  recentActivity: { date: string; type: string; description: string; amount?: number }[];
}

type TimeRange = "7d" | "30d" | "90d" | "1y";

export const useAnalytics = (timeRange: TimeRange = "30d") => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    // Note: Local backend currently doesn't require user auth for analytics demo
    setLoading(true);

    try {
      const backendData = await analyticsService.getAnalytics();
      const avgPriceData = backendData.data.averagePricePerKg || [];

      // Map backend data to frontend structure (Polyfill for demo)
      setData({
        totalRevenue: 0, // Not provided by simple backend yet
        totalTransactions: backendData.data.totalWasteCollected || 0, // Using total waste as proxy
        activeListings: 0,
        pendingOffers: 0,
        revenueByPeriod: [],
        listingsByPeriod: [],
        offersByStatus: [],
        ordersByStatus: [],
        topWasteTypes: avgPriceData.map((item: any) => ({
          type: item.wasteType,
          count: 1,
          revenue: item.avgPricePerKg
        })),
        recentActivity: [],
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, loading, refetch: fetchAnalytics };
};
