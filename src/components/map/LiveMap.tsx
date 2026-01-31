import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import { io, Socket } from "socket.io-client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Navigation, Truck } from "lucide-react";

// Fix Leaflet marker icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { renderToStaticMarkup } from "react-dom/server";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const SOCKET_URL = import.meta.env.VITE_BASE_URL?.replace("/api", "") || "http://localhost:3000";

// Custom Truck Icon
const createTruckIcon = () => {
    const iconHtml = renderToStaticMarkup(
        <div className="bg-primary p-1.5 rounded-full shadow-lg border-2 border-white transform hover:scale-110 transition-transform">
            <Truck className="w-5 h-5 text-bg-slate-900" fill="currentColor" />
        </div>
    );

    return L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-icon",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};

const truckIcon = createTruckIcon();

interface LiveMapProps {
    requestId: string;
    // role: "generator" | "middleman" | "recycler";
    role: string;
}

// Component to recenter map when position changes
const RecenterMap = ({ position, isNavigating }: { position: [number, number], isNavigating: boolean }) => {
    const map = useMap();
    useEffect(() => {
        if (isNavigating) {
            map.flyTo(position, 16, { animate: true, duration: 1.5 });
        }
    }, [position, map, isNavigating]);
    return null;
};

const LiveMap = ({ requestId, role }: LiveMapProps) => {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [path, setPath] = useState<[number, number][]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const { user } = useAuth();
    const watchIdRef = useRef<number | null>(null);

    // Initial load: Try to get current position if not known
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
            });
        }
    }, []);

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
            const newPos: [number, number] = [data.lat, data.lng];
            setPosition(newPos);
            setPath((prev) => [...prev, newPos]);
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
                    const newPos: [number, number] = [latitude, longitude];

                    setPosition(newPos);
                    setPath(prev => [...prev, newPos]); // Add to local path too

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
                <MapContainer center={position} zoom={15} scrollWheelZoom={true} className="w-full h-full z-0">
                    {/* Dark Mode Tiles */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    {/* The Path Polyline */}
                    <Polyline
                        positions={path}
                        color="#C1FF72"
                        weight={5}
                        opacity={0.8}
                        lineCap="round"
                        lineJoin="round"
                    />

                    {/* The Truck/User Marker */}
                    <Marker position={position} icon={truckIcon}>
                        <Popup className="custom-popup">
                            <div className="p-2 text-center">
                                <p className="font-bold text-gray-800">{role === "middleman" ? "You" : "Middleman"}</p>
                                <p className="text-xs text-gray-500">{(new Date()).toLocaleTimeString()}</p>
                            </div>
                        </Popup>
                    </Marker>

                    <RecenterMap position={position} isNavigating={isNavigating || role !== "middleman"} />
                </MapContainer>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                    <div className="text-center">
                        <Truck className="w-10 h-10 mx-auto text-primary animate-bounce mb-2" />
                        <p className="text-gray-400 animate-pulse">Locating signal...</p>
                    </div>
                </div>
            )}

            {/* Middleman Controls */}
            {role === "middleman" && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400]">
                    {!isNavigating ? (
                        <Button onClick={startNavigation} className="bg-[#C1FF72] text-black hover:bg-[#aef060] font-bold px-8 py-6 rounded-full shadow-[0_0_20px_rgba(193,255,114,0.3)] transition-all hover:scale-105">
                            <Navigation className="w-5 h-5 mr-2" /> START ROUTE
                        </Button>
                    ) : (
                        <Button onClick={stopNavigation} variant="destructive" className="px-8 py-6 rounded-full shadow-lg font-bold">
                            STOP ROUTE
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default LiveMap;
