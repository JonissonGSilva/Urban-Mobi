
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Plus, Search, Map as MapIcon, Layers, Loader2, Save, Trash2, X, Check, GripVertical } from 'lucide-react';
import { getCurrentPosition, reverseGeocode, searchAddress, GeocodedAddress } from '../services/geocoding';
import { Route as RouteType, Location as LocationType } from '../types';

const Routes: React.FC = () => {
  const [map, setMap] = useState<any>(null);
  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(null);
  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodedAddress[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Waypoints State
  const [waypoints, setWaypoints] = useState<GeocodedAddress[]>([]);
  
  // Save Route State
  const [savedRoutes, setSavedRoutes] = useState<RouteType[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newRouteName, setNewRouteName] = useState("");
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);

  // Load saved routes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('urban_mobi_saved_routes');
    if (stored) {
      try {
        setSavedRoutes(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved routes", e);
      }
    }
  }, []);

  // Save to localStorage whenever savedRoutes changes
  useEffect(() => {
    localStorage.setItem('urban_mobi_saved_routes', JSON.stringify(savedRoutes));
  }, [savedRoutes]);

  // Update Map visual markers and lines whenever waypoints or userLoc change
  useEffect(() => {
    if (!map) return;
    const L = (window as any).L;

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Clear old polyline
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
    }

    const points: [number, number][] = [];

    // Add user location marker
    if (userLoc) {
      const userMarker = L.marker([userLoc.lat, userLoc.lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })
      }).addTo(map).bindPopup('Origin Point');
      markersRef.current.push(userMarker);
      points.push([userLoc.lat, userLoc.lng]);
    }

    // Add waypoint markers
    waypoints.forEach((wp, idx) => {
      const marker = L.marker([wp.lat, wp.lon]).addTo(map).bindPopup(`Stop ${idx + 1}: ${wp.display_name.split(',')[0]}`);
      markersRef.current.push(marker);
      points.push([wp.lat, wp.lon]);
    });

    // Draw polyline connecting points
    if (points.length > 1) {
      polylineRef.current = L.polyline(points, {
        color: '#3b82f6',
        weight: 5,
        opacity: 0.7,
        lineJoin: 'round'
      }).addTo(map);

      // Fit bounds if more than 1 point
      if (waypoints.length > 0) {
        map.fitBounds(polylineRef.current.getBounds(), { padding: [80, 80] });
      }
    }
  }, [map, waypoints, userLoc]);

  const initMap = (lat: number, lng: number) => {
    const L = (window as any).L;
    if (!map && mapContainerRef.current) {
      const initialMap = L.map('route-map', {
        zoomControl: false,
        attributionControl: false
      }).setView([lat, lng], 15);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(initialMap);

      setMap(initialMap);
    } else if (map) {
      map.setView([lat, lng], 15);
    }
  };

  const handleLocate = async () => {
    setLocating(true);
    try {
      const pos = await getCurrentPosition();
      const { latitude, longitude } = pos.coords;
      setUserLoc({ lat: latitude, lng: longitude });
      initMap(latitude, longitude);
    } catch (err) {
      console.error("Locate error:", err);
    } finally {
      setLocating(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length < 3) return;
    setIsSearching(true);
    const results = await searchAddress(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const addWaypoint = (res: GeocodedAddress) => {
    setWaypoints(prev => [...prev, res]);
    setSearchResults([]);
    setSearchQuery("");
  };

  const removeWaypoint = (idx: number) => {
    setWaypoints(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveCurrentRoute = () => {
    if (waypoints.length === 0 || !newRouteName.trim()) return;

    const newRoute: RouteType = {
      id: Date.now().toString(),
      name: newRouteName.trim(),
      origin: {
        lat: userLoc?.lat || 0,
        lng: userLoc?.lng || 0,
        name: userLoc ? "Starting Point" : "Unknown Start"
      },
      destination: {
        lat: waypoints[waypoints.length - 1].lat,
        lng: waypoints[waypoints.length - 1].lon,
        name: waypoints[waypoints.length - 1].display_name
      },
      waypoints: waypoints.map(wp => ({
        lat: wp.lat,
        lng: wp.lon,
        name: wp.display_name
      })),
      isActive: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSavedRoutes(prev => [newRoute, ...prev]);
    setShowSaveDialog(false);
    setNewRouteName("");
  };

  const deleteSavedRoute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger load when deleting
    setSavedRoutes(prev => prev.filter(r => r.id !== id));
  };

  const loadSavedRoute = (route: RouteType) => {
    // 1. Load Origin
    if (route.origin) {
      setUserLoc({ lat: route.origin.lat, lng: route.origin.lng });
    }

    // 2. Load Waypoints (which includes destination in this app logic)
    if (route.waypoints && route.waypoints.length > 0) {
      setWaypoints(route.waypoints.map(wp => ({
        lat: wp.lat,
        lon: wp.lng,
        display_name: wp.name
      })));
    } else {
      // Fallback if only destination exists in Route type but no waypoints array
      setWaypoints([{
        lat: route.destination.lat,
        lon: route.destination.lng,
        display_name: route.destination.name
      }]);
    }
  };

  const handleStartNavigation = () => {
    if (waypoints.length === 0) return;
    alert(`Starting navigation for ${waypoints.length} stops! Safe travels.`);
  };

  useEffect(() => {
    handleLocate();
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col -m-4 relative overflow-hidden">
      {/* Search Bar Container */}
      <div className="absolute top-4 left-4 right-4 z-[1000] transition-all duration-300">
        <form 
          onSubmit={handleSearch}
          className="bg-white rounded-[1.5rem] shadow-xl shadow-black/10 border border-gray-100 p-1.5 flex items-center space-x-2"
        >
          <div className="p-2 text-blue-600">
            {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Add stop to route..." 
            className="flex-1 py-2 outline-none text-[15px] text-gray-700 bg-transparent font-medium"
          />
          <button 
            type="button"
            onClick={handleLocate}
            disabled={locating}
            className={`bg-gray-50 p-2.5 rounded-2xl text-blue-600 hover:bg-blue-50 transition-colors ${locating ? 'animate-pulse' : ''}`}
          >
            <Navigation size={20} fill={locating ? "currentColor" : "none"} />
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-300">
            {searchResults.map((res, i) => (
              <button 
                key={i}
                onClick={() => addWaypoint(res)}
                className="w-full p-4 flex items-start space-x-3 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0"
              >
                <div className="mt-0.5 text-blue-600 shrink-0">
                  <Plus size={18} />
                </div>
                <span className="text-sm font-medium text-gray-700 truncate">{res.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-gray-100">
        <div id="route-map" ref={mapContainerRef} className="w-full h-full z-0"></div>
        
        <div className="absolute top-24 right-4 z-[1000] flex flex-col space-y-3">
          <button className="bg-white p-3.5 rounded-2xl shadow-lg text-gray-700 active:scale-95 transition-all">
             <MapIcon size={20} />
          </button>
          <button className="bg-white p-3.5 rounded-2xl shadow-lg text-gray-700 active:scale-95 transition-all">
             <Layers size={20} />
          </button>
        </div>

        {/* Reset FAB - Clears Current State */}
        <button 
          onClick={() => {
            setWaypoints([]);
            setSearchQuery("");
            handleLocate();
          }}
          title="Clear current route"
          className="absolute bottom-64 right-4 z-[1000] bg-white text-gray-500 p-4 rounded-[1.5rem] shadow-xl border border-gray-100 active:scale-90 transition-all"
        >
          <Trash2 size={24} strokeWidth={2} />
        </button>

        {/* Bottom Drawer Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-[1000]">
          <div className="bg-white rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.12)] p-6 space-y-5 animate-in slide-in-from-bottom duration-500 max-h-[75vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2"></div>
            
            {waypoints.length > 0 ? (
              // Active Route Waypoints Details
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Current Route</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{waypoints.length} stops</span>
                    <button 
                      onClick={() => setShowSaveDialog(true)}
                      className="bg-blue-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                    >
                      <Save size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Start Point */}
                  <div className="flex items-center space-x-4 pl-1">
                    <div className="relative flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-sm z-10"></div>
                      <div className="w-0.5 h-10 bg-gray-200 -mb-2 mt-1"></div>
                    </div>
                    <div className="pb-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Start</p>
                      <p className="text-sm font-bold text-gray-600">Originating location</p>
                    </div>
                  </div>

                  {waypoints.map((wp, i) => (
                    <div key={i} className="flex items-center space-x-4 pl-1">
                      <div className="relative flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-gray-300 border-2 border-white shadow-sm z-10"></div>
                        {i < waypoints.length - 1 && <div className="w-0.5 h-10 bg-gray-200 -mb-2 mt-1"></div>}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-2xl p-3 flex items-center justify-between min-w-0">
                        <div className="truncate pr-2">
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Stop {i + 1}</p>
                          <p className="text-sm font-bold text-gray-800 truncate">{wp.display_name.split(',')[0]}</p>
                        </div>
                        <button 
                          onClick={() => removeWaypoint(i)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg shrink-0"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  <button 
                    onClick={handleStartNavigation}
                    className="bg-blue-600 text-white py-4 rounded-2xl text-[15px] font-bold flex items-center justify-center space-x-2 shadow-xl shadow-blue-600/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Navigation size={18} fill="currentColor" />
                    <span>Start Navigation</span>
                  </button>
                </div>
              </div>
            ) : (
              // Saved Routes List
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Saved Routes</h3>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{savedRoutes.length} saved</span>
                </div>
                
                {savedRoutes.length > 0 ? (
                  <div className="space-y-3">
                    {savedRoutes.map((route) => (
                      <div 
                        key={route.id} 
                        onClick={() => loadSavedRoute(route)}
                        className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between group transition-all hover:bg-blue-50 active:scale-[0.98] cursor-pointer border border-transparent hover:border-blue-100"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0 text-left">
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-xl shrink-0">
                            <Navigation size={16} fill="currentColor" />
                          </div>
                          <div className="truncate">
                            <h4 className="text-sm font-bold text-gray-800 truncate">{route.name}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">
                              {route.waypoints ? `${route.waypoints.length} stops` : '1 stop'} • {route.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                           <button 
                             onClick={(e) => deleteSavedRoute(route.id, e)}
                             className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg active:scale-90 transition-colors"
                           >
                             <Trash2 size={16} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <MapIcon size={32} />
                    </div>
                    <p className="text-sm font-bold text-gray-600">Your map is empty</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">Add stops to your route to start planning your urban journey.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Route Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900">Save Journey</h3>
              <button onClick={() => setShowSaveDialog(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">
                  Journey Name
                </label>
                <input 
                  autoFocus
                  type="text"
                  placeholder="e.g., Morning Commute"
                  value={newRouteName}
                  onChange={(e) => setNewRouteName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-800"
                />
              </div>

              <div className="bg-blue-50 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">Sequence Preview</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold bg-white text-gray-400 px-2 py-1 rounded-lg border border-blue-100">Start</span>
                  {waypoints.map((_, i) => (
                    <React.Fragment key={i}>
                      <span className="text-blue-300">→</span>
                      <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-1 rounded-lg">Stop {i+1}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSaveCurrentRoute}
                disabled={!newRouteName.trim() || waypoints.length === 0}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all"
              >
                <Check size={20} strokeWidth={3} />
                <span>Save to My Routes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Routes;
