
import React from 'react';
import { MOCK_ALERTS } from '../constants';
import { CloudRain, Car, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';

const Alerts: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-800">Alert Center</h2>
        <p className="text-gray-500 text-sm">Stay informed about your surroundings.</p>
      </header>

      <div className="space-y-4">
        {MOCK_ALERTS.map((alert) => (
          <div 
            key={alert.id} 
            className={`bg-white rounded-3xl p-5 border shadow-sm relative overflow-hidden transition-all hover:scale-[1.01] ${
              !alert.read ? 'border-blue-200' : 'border-gray-100 opacity-80'
            }`}
          >
            {!alert.read && (
              <div className="absolute top-0 right-0 w-8 h-8 bg-blue-600 flex items-center justify-center rounded-bl-2xl">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              </div>
            )}
            
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-2xl ${
                alert.type === 'traffic' ? 'bg-amber-50 text-amber-500' : 
                alert.type === 'weather' ? 'bg-blue-50 text-blue-500' : 
                'bg-red-50 text-red-500'
              }`}>
                {alert.type === 'traffic' ? <Car size={24} /> : 
                 alert.type === 'weather' ? <CloudRain size={24} /> : 
                 <AlertTriangle size={24} />}
              </div>
              
              <div className="flex-1 pr-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-gray-800 leading-tight">{alert.title}</h3>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                    {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-normal mb-3">{alert.description}</p>
                
                <div className="flex items-center space-x-2">
                  <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center">
                    Report Impact
                    <ChevronRight size={12} className="ml-1" />
                  </button>
                  {alert.read && (
                    <div className="flex items-center text-[10px] font-bold text-gray-400 space-x-1">
                      <CheckCircle2 size={12} />
                      <span>Read</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-gray-100 rounded-3xl p-8 border-2 border-dashed border-gray-200 flex flex-col items-center text-center">
         <div className="bg-white p-3 rounded-full shadow-sm mb-4 text-gray-400">
           <CheckCircle2 size={24} />
         </div>
         <h4 className="font-bold text-gray-700">No more critical alerts</h4>
         <p className="text-xs text-gray-400 mt-1 max-w-[200px]">You've reviewed all your recent mobility notifications.</p>
      </section>
    </div>
  );
};

export default Alerts;
