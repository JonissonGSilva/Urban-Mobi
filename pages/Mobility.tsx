
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Calendar, TrendingDown, DollarSign, Clock, Map as MapIcon, ChevronRight } from 'lucide-react';

const Mobility: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'economy' | 'history'>('economy');

  const costData = [
    { name: 'Mon', cost: 12.5 },
    { name: 'Tue', cost: 0 },
    { name: 'Wed', cost: 15.2 },
    { name: 'Thu', cost: 8.4 },
    { name: 'Fri', cost: 0 },
    { name: 'Sat', cost: 5.0 },
    { name: 'Sun', cost: 2.1 },
  ];

  const distributionData = [
    { name: 'Office', value: 3, color: '#3b82f6' },
    { name: 'Home', value: 2, color: '#10b981' },
    { name: 'Hybrid', value: 1, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6 pb-4">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mobility</h2>
          <p className="text-gray-500 text-sm">Optimize your work-life balance.</p>
        </div>
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex text-xs font-bold">
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'calendar' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
          >
            Calendar
          </button>
          <button 
            onClick={() => setActiveTab('economy')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'economy' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
          >
            Economy
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
          >
            History
          </button>
        </div>
      </header>

      {activeTab === 'economy' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
             <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg mb-2">
                   <DollarSign size={16} />
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Cost</span>
                <span className="text-sm font-bold text-gray-800">$43.2</span>
             </div>
             <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg mb-2">
                   <Clock size={16} />
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Time</span>
                <span className="text-sm font-bold text-gray-800">5.4h</span>
             </div>
             <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg mb-2">
                   <MapIcon size={16} />
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Dist</span>
                <span className="text-sm font-bold text-gray-800">82km</span>
             </div>
          </div>

          {/* Chart Section */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-6 flex items-center">
              <TrendingDown className="text-emerald-500 mr-2" size={18} />
              Weekly Expenditure
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="cost" radius={[4, 4, 4, 4]}>
                    {costData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cost > 10 ? '#3b82f6' : '#93c5fd'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Distribution Section */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center">
             <div className="flex-1">
               <h3 className="text-sm font-bold text-gray-700 mb-1">Commute Type</h3>
               <p className="text-xs text-gray-400 mb-4">Last 7 days distribution</p>
               <div className="space-y-2">
                 {distributionData.map((item) => (
                   <div key={item.name} className="flex items-center space-x-2">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                     <span className="text-xs font-bold text-gray-600">{item.name}</span>
                     <span className="text-xs text-gray-400 ml-auto">{item.value} days</span>
                   </div>
                 ))}
               </div>
             </div>
             <div className="w-32 h-32">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={distributionData}
                      innerRadius={35}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                 </PieChart>
               </ResponsiveContainer>
             </div>
          </section>

          {/* Savings Call to Action */}
          <div className="bg-blue-600 rounded-3xl p-6 text-white flex justify-between items-center shadow-lg shadow-blue-200">
             <div>
               <p className="text-xs font-bold text-blue-100 uppercase tracking-widest">Projection</p>
               <h3 className="text-2xl font-bold mt-1">Save $120+</h3>
               <p className="text-[10px] text-blue-100 mt-1 opacity-80">By switching 1 more day to WFH</p>
             </div>
             <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
               <ChevronRight size={24} />
             </button>
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center py-20">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">Calendar view is being synced with your corporate workspace.</p>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
             <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <MapIcon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Apartment → Office</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Jan {10+i}, 2024 • 08:32 AM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">$14.50</p>
                  <p className="text-[10px] text-emerald-500 font-bold">Standard</p>
                </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mobility;
