
export interface GeocodedAddress {
  display_name: string;
  lat: number;
  lon: number;
}

export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Seu navegador não suporta geolocalização."));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            reject(new Error("Permissão de localização negada. Verifique as configurações do navegador."));
            break;
          case err.POSITION_UNAVAILABLE:
            reject(new Error("Informações de localização indisponíveis no momento."));
            break;
          case err.TIMEOUT:
            reject(new Error("Tempo esgotado ao tentar obter localização."));
            break;
          default:
            reject(new Error("Ocorreu um erro desconhecido ao obter a localização."));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
};

export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'pt-BR,pt;q=0.5',
          'User-Agent': 'UrbanMobiAlert/1.0'
        }
      }
    );
    const data = await response.json();
    return data.display_name || "Localização Desconhecida";
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
};

export const searchAddress = async (query: string): Promise<GeocodedAddress[]> => {
  if (!query || query.length < 3) return [];
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
      {
        headers: {
          'User-Agent': 'UrbanMobiAlert/1.0'
        }
      }
    );
    const data = await response.json();
    return data.map((item: any) => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error("Geocoding search failed:", error);
    return [];
  }
};
