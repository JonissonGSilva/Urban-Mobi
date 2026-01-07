
import React, { useState, useEffect } from 'react';
import RiskGauge from '../components/RiskGauge';
import { getRiskAnalysis, RiskAnalysisResponse } from '../services/gemini';
import { getCurrentPosition, reverseGeocode } from '../services/geocoding';
import { Zap, CloudRain, Car, Info, Sparkles, RefreshCcw, MapPin, AlertCircle, Map as MapIcon } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [analysis, setAnalysis] = useState<RiskAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState<string>("Detectando...");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async (forceLocationRequest: boolean = false) => {
    setLoading(true);
    setError(null);
    if (forceLocationRequest) setLocationError(null);

    try {
      let context = "A standard busy metropolitan area on a weekday";
      
      try {
        const pos = await getCurrentPosition();
        const name = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setLocationName(name.split(',')[0] + (name.split(',')[1] ? ', ' + name.split(',')[1] : ''));
        context = `At coordinates (${pos.coords.latitude}, ${pos.coords.longitude}), near ${name}. Current urban mobility risk assessment.`;
        setLocationError(null);
      } catch (locErr: any) {
        console.warn("Location fetch failed:", locErr.message);
        setLocationError(locErr.message);
        setLocationName("São Paulo, SP (Default)");
        context = "A metropolitan capital city like São Paulo. General mobility risk analysis.";
      }

      const result = await getRiskAnalysis(context);
      setAnalysis(result);
    } catch (err) {
      setError("Erro ao carregar análise de risco.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Greetings & Location */}
      <section className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Olá, Alex! 👋</h2>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <MapPin size={14} className={`mr-1 ${locationError ? 'text-amber-500' : 'text-blue-500'}`} />
            <span className="truncate max-w-[220px]">{locationName}</span>
          </div>
        </div>
        <button 
          onClick={() => fetchAnalysis(true)}
          disabled={loading}
          className={`p-2.5 rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 active:scale-95 transition-all ${loading ? 'animate-spin text-blue-500' : ''}`}
        >
          <RefreshCcw size={20} />
        </button>
      </section>

      {/* Location Error Banner */}
      {locationError && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start space-x-3 animate-in slide-in-from-top-2">
          <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <div className="flex-1">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">Problema com Localização</p>
            <p className="text-xs text-amber-700 mt-0.5">{locationError}</p>
            <button 
              onClick={() => fetchAnalysis(true)}
              className="mt-2 text-xs font-black text-amber-800 underline decoration-amber-300"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {/* Risk Analysis Card */}
      <section className="bg-white rounded-[2rem] p-6 shadow-xl shadow-blue-900/5 border border-gray-100 relative overflow-hidden transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
          <RiskGauge score={analysis?.score || 0} />
          
          <div className="mt-6 md:mt-0 flex-1 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <Zap className="text-amber-500 mr-2" size={20} fill="currentColor" />
                Análise de Risco AI
              </h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50/80 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center border border-blue-100">
                <CloudRain className="text-blue-500 mb-2" size={22} />
                <span className="text-[10px] text-gray-500 font-bold uppercase">Clima</span>
                <span className="text-lg font-black text-blue-700">+{analysis?.factors.weather}</span>
              </div>
              <div className="bg-rose-50/80 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center border border-rose-100">
                <Car className="text-rose-500 mb-2" size={22} />
                <span className="text-[10px] text-gray-500 font-bold uppercase">Tráfego</span>
                <span className="text-lg font-black text-rose-700">+{analysis?.factors.traffic}</span>
              </div>
              <div className="bg-indigo-50/80 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center border border-indigo-100">
                <Sparkles className="text-indigo-500 mb-2" size={22} />
                <span className="text-[10px] text-gray-500 font-bold uppercase">Eventos</span>
                <span className="text-lg font-black text-indigo-700">+{analysis?.factors.events}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="space-y-4">
        <h3 className="font-bold text-gray-800 flex items-center px-1">
          <Info className="text-blue-600 mr-2" size={18} />
          Recomendações Inteligentes
        </h3>
        
        <div className="space-y-3">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl w-full"></div>
            ))
          ) : error ? (
            <div className="bg-red-50 p-6 rounded-2xl text-red-600 text-center border border-red-100">
              <p className="font-bold">{error}</p>
              <button onClick={() => fetchAnalysis()} className="mt-2 text-xs underline">Tentar recarregar dados</button>
            </div>
          ) : (
            analysis?.recommendations.map((rec, idx) => (
              <div 
                key={idx} 
                className="bg-white p-5 rounded-2xl border-l-[6px] border-blue-600 shadow-md shadow-gray-200/50 flex items-start space-x-4 transition-transform active:scale-[0.98]"
              >
                <div className="mt-0.5 bg-blue-100 p-2 rounded-xl text-blue-600 shrink-0">
                  <Sparkles size={18} fill="currentColor" />
                </div>
                <p className="text-[15px] text-gray-700 font-semibold leading-snug">{rec}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Quick Access Card */}
      <section className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Planejar Trajeto</h3>
          <p className="text-indigo-100 text-xs mt-1">Evite riscos com rotas otimizadas.</p>
        </div>
        <div className="bg-white/20 p-3 rounded-2xl">
          <MapIcon size={24} />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
