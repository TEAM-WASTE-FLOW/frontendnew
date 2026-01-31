import { useParams } from "react-router-dom";
import LiveMap from "@/components/map/LiveMap";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TrackingPage = () => {
    const { requestId } = useParams<{ requestId: string }>();
    const { user } = useAuth();
    const role = user?.role || "generator"; // Default to generator if not logged in

    // Mock data - in real app would come from a query using requestId
    const mockTrackingData = {
        middlemanName: "Hugo Solano",
        wasteType: "Plastic & Metal",
        eta: "8 min",
        destination: role === "middleman" ? "Recycling Plant A" : "Your Location"
    };

    return (
        <div className="container mx-auto p-4 max-w-5xl h-[calc(100vh-80px)] flex flex-col">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold">Live Tracking</h1>
                    <p className="text-muted-foreground text-sm">Request #{requestId?.slice(0, 8)}...</p>
                </div>
                <Badge variant={role === "middleman" ? "default" : "secondary"} className="text-md px-3 py-1 uppercase tracking-wider">
                    {role} View
                </Badge>
            </div>

            <div className="flex-1 min-h-[500px] relative rounded-2xl overflow-hidden shadow-2xl border-2 border-border/50">
                {requestId ? (
                    <LiveMap
                        requestId={requestId}
                        role={role}
                        // middlemanName={mockTrackingData.middlemanName}
                        // wasteType={mockTrackingData.wasteType}
                        // eta={mockTrackingData.eta}
                        // destination={mockTrackingData.destination}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                        <p className="text-destructive">Invalid Request ID</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackingPage;
