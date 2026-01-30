import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';

// Fix for default marker icon in leaflet with webpack/vite
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const LogisticsMap = () => {
    // Mock shipments
    const [shipments] = useState([
        { id: 1, lat: 6.5244, lng: 3.3792, status: 'In Transit', from: 'Lagos Island', to: 'Recycling Hub A' }, // Lagos
        { id: 2, lat: 6.6018, lng: 3.3515, status: 'Scheduled', from: 'Ikeja', to: 'Recycling Hub B' },
    ]);

    return (
        <div className="h-[500px] w-full rounded-2xl overflow-hidden border border-border shadow-soft z-0 relative">
            <MapContainer
                center={[6.5244, 3.3792]}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {shipments.map(shipment => (
                    <Marker key={shipment.id} position={[shipment.lat, shipment.lng]} icon={defaultIcon}>
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-bold">{shipment.status}</h3>
                                <p className="text-sm">From: {shipment.from}</p>
                                <p className="text-sm">To: {shipment.to}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Overlay Stats */}
            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-border z-[1000] max-w-xs">
                <h4 className="font-bold text-sm mb-2">Live Logistics</h4>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Active Vehicles:</span>
                        <span className="font-mono font-bold">2</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">In Transit:</span>
                        <span className="font-mono text-amber-500 font-bold">1</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Arriving &lt; 10m:</span>
                        <span className="font-mono text-emerald-500 font-bold">0</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogisticsMap;
