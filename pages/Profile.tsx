
import React from 'react';
import { 
  User, 
  Award, 
  Settings, 
  Bell, 
  CreditCard, 
  HelpCircle, 
  LogOut, 
  ShieldCheck,
  ChevronRight,
  Target
} from 'lucide-react';

const Profile: React.FC = () => {
  const menuItems = [
    { label: 'General Preferences', icon: <Settings size={20} />, color: 'text-gray-500' },
    { label: 'Notifications', icon: <Bell size={20} />, color: 'text-blue-500' },
    { label: 'Payment Methods', icon: <CreditCard size={20} />, color: 'text-emerald-500' },
    { label: 'Privacy & Security', icon: <ShieldCheck size={20} />, color: 'text-indigo-500' },
    { label: 'Support & Feedback', icon: <HelpCircle size={20} />, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-8 pb-4">
      {/* Profile Card */}
      <section className="flex flex-col items-center pt-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-blue-100 p-1">
            <img 
              src="https://picsum.photos/seed/alex/200" 
              alt="Profile" 
              className="w-full h-full rounded-2xl object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-xl shadow-lg border-2 border-white">
            <Award size={16} />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mt-4">Alex Martinez</h2>
        <p className="text-sm text-gray-500 font-medium">Urban Explorer • Lvl 14</p>
      </section>

      {/* Stats Board */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <Target className="text-blue-600" size={18} />
             <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Top 5%</span>
           </div>
           <p className="text-2xl font-bold text-gray-800">12,450</p>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Experience</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <Award className="text-amber-500" size={18} />
             <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Explorer</span>
           </div>
           <p className="text-2xl font-bold text-gray-800">12</p>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Achievements</p>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
          <span className="text-gray-500">Level 14</span>
          <span className="text-blue-600">850 / 1000 XP</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
        </div>
        <p className="text-[10px] text-gray-400 text-center font-medium">Earn 150 more XP to unlock 'Carbon Warrior' badge!</p>
      </section>

      {/* Menu List */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {menuItems.map((item, idx) => (
          <button 
            key={idx}
            className={`w-full flex items-center justify-between p-5 text-gray-700 hover:bg-gray-50 transition-colors ${
              idx !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={item.color}>{item.icon}</div>
              <span className="text-sm font-semibold">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
        ))}
      </section>

      {/* Logout */}
      <button className="w-full flex items-center justify-center space-x-2 p-5 text-red-500 font-bold hover:bg-red-50 transition-all rounded-3xl border-2 border-dashed border-red-100">
        <LogOut size={20} />
        <span>Sign Out</span>
      </button>

      <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest pb-4">
        Urban Mobi Alert v2.4.0
      </p>
    </div>
  );
};

export default Profile;
