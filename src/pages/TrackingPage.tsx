import { useParams } from "react-router-dom";
import LiveMap from "@/components/map/LiveMap";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TrackingPage = () => {
    const { requestId } = useParams<{ requestId: string }>();
    const { user } = useAuth();
    const role = user?.role || "generator"; // Default to generator if not logged in (e.g. view only)

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-display">Live Tracking</CardTitle>
                        <p className="text-muted-foreground">Request ID: #{requestId}</p>
                    </div>

                    <Badge variant="outline" className="text-lg px-4 py-1">
                        {role === "middleman" ? "Broadcasting Location" : "Tracking Waste Flow"}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl overflow-hidden border shadow-sm">
                        {requestId ? (
                            <LiveMap requestId={requestId} role={role} />
                        ) : (
                            <div className="p-8 text-center text-red-500">Invalid Request ID</div>
                        )}
                    </div>

                    <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-semibold mb-2">Instructions</h3>
                        {role === "middleman" ? (
                            <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                <li>Click "Start Navigation" to begin broadcasting your location.</li>
                                <li>Ensure you have granted GPS permissions to the browser.</li>
                                <li>Do not close this tab while delivering.</li>
                            </ul>
                        ) : (
                            <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                <li>The map will update automatically when the collector starts moving.</li>
                                <li>If the marker is not moving, the collector might have paused navigation.</li>
                            </ul>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TrackingPage;
