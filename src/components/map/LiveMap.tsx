import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { io, Socket } from "socket.io-client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

// Fix Leaflet marker icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const SOCKET_URL = import.meta.env.VITE_BASE_URL?.replace("/api", "") || "http://localhost:3000";

interface LiveMapProps {
    requestId: string;
    role: "generator" | "middleman" | "recycler";
}

// Component to recenter map when position changes
const RecenterMap = ({ position }: { position: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(position, map.getZoom());
    }, [position, map]);
    return null;
};

const LiveMap = ({ requestId, role }: LiveMapProps) => {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const { user } = useAuth();
    const watchIdRef = useRef<number | null>(null);

    useEffect(() => {
        // 1. Connect to Socket
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Connected to Tracking Socket:", newSocket.id);
            newSocket.emit("join_tracking", { requestId });
        });

        // 2. Listen for updates (for Generator/Recycler)
        newSocket.on("location_updated", (data: { lat: number; lng: number; role: string }) => {
            console.log("Location received:", data);
            setPosition([data.lat, data.lng]);
        });

        return () => {
            newSocket.disconnect();
            if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
        };
    }, [requestId]);

    // 3. Middleman Tracking Logic (Sender)
    const startNavigation = () => {
        if (role !== "middleman") return;
        setIsNavigating(true);

        if ("geolocation" in navigator) {
            watchIdRef.current = navigator.geolocation.watchPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition([latitude, longitude]);

                    if (socket) {
                        socket.emit("update_location", {
                            requestId,
                            lat: latitude,
                            lng: longitude,
                            role: "middleman",
                        });
                    }
                },
                (err) => console.error("Error getting location", err),
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }
    };

    const stopNavigation = () => {
        setIsNavigating(false);
        if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };

    return (
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden border-2 border-primary/20 shadow-elevated">
            {position ? (
                <MapContainer center={position} zoom={15} scrollWheelZoom={true} className="w-full h-full">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>
                            {role === "middleman" ? "You are here" : "Middleman's Location"}
                        </Popup>
                    </Marker>
                    <RecenterMap position={position} />
                </MapContainer>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <p className="text-muted-foreground animate-pulse">Waiting for location signal...</p>
                </div>
            )}

            {/* Middleman Controls */}
            {role === "middleman" && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
                    {!isNavigating ? (
                        <Button onClick={startNavigation} variant="hero" className="shadow-lg">
                            <Navigation className="w-4 h-4 mr-2" /> Start Navigation
                        </Button>
                    ) : (
                        <Button onClick={stopNavigation} variant="destructive" className="shadow-lg">
                            Stop Navigation
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default LiveMap;
