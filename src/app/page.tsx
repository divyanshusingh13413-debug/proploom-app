
'use client';
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Video, 
  TrendingUp, 
  Search,
  UserCircle,
  LogOut
} from 'lucide-react';

const DashboardPage = () => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'Leads', icon: Users, active: false },
    { name: 'WhatsApp', icon: MessageSquare, active: false },
    { name: 'Virtual Tour', icon: Video, active: false },
    { name: 'Sales', icon: TrendingUp, active: false },
  ];

  return (
    <div className="fixed inset-0 flex bg-[#0F1115] text-white overflow-hidden z-[9999]">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-72 border-r border-gray-800/50 flex flex-col bg-[#0F1115]">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <span className="font-black text-black text-xl">P</span>
          </div>
          <span className="text-2xl font-bold tracking-tighter uppercase tracking-widest">Proploom</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                item.active 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold shadow-xl shadow-orange-500/20' 
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <item.icon size={22} />
              <span className="text-md font-semibold">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-8">
          <button className="flex items-center gap-4 px-6 py-4 text-gray-500 hover:text-red-400 w-full transition-colors border border-gray-800 rounded-2xl hover:border-red-400/30">
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* RIGHT SIDE CONTENT */}
      <main className="flex-1 overflow-y-auto bg-[#0F1115] p-10 custom-scrollbar relative">
        
        {/* Header - Now part of the main content, not a separate bar */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">Overview</h1>
            <p className="text-gray-500 mt-2 font-medium">Real Estate Analytics & Performance</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-600" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-[#161920] border border-gray-800/50 rounded-2xl py-3.5 pl-12 pr-6 w-72 text-sm focus:outline-none focus:border-orange-500 transition-all shadow-xl"
              />
            </div>
            
            <div className="flex items-center gap-3 bg-[#161920] p-2 pr-5 rounded-2xl border border-gray-800/50 shadow-lg">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-[10px] bg-[#161920] flex items-center justify-center">
                    <UserCircle size={24} className="text-orange-500" />
                  </div>
               </div>
               <div>
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter leading-none mb-1">Agent</p>
                 <span className="text-sm font-black">Sheikh Al Raihan</span>
               </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { label: 'Active Leads', value: '128', icon: Users, color: 'text-blue-400' },
              { label: 'Total Sales', value: '$4.2M', icon: TrendingUp, color: 'text-orange-500' },
              { label: 'Virtual Tours', value: '45', icon: Video, color: 'text-purple-400' }
            ].map((stat) => (
              <div key={stat.label} className="bg-[#161920] p-8 rounded-[35px] border border-gray-800/50 hover:border-orange-500/40 transition-all group shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-gray-800/30 rounded-2xl group-hover:scale-110 transition-transform">
                    <stat.icon className={stat.color} size={28} />
                  </div>
                  <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-3 py-1.5 rounded-full uppercase">
                    +12% Up
                  </span>
                </div>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-[2px] mb-1">{stat.label}</p>
                <h3 className="text-4xl font-black tracking-tighter">{stat.value}</h3>
              </div>
            ))}
        </div>

        {/* Dashboard Empty State / Placeholder */}
        <div className="bg-gradient-to-b from-[#161920] to-[#0F1115] border border-gray-800/50 rounded-[45px] p-12 h-[450px] flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mb-6">
              <TrendingUp size={40} className="text-orange-500 opacity-50" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Detailed Analytics</h2>
            <p className="text-gray-500 max-w-sm mb-8">Select a category from the sidebar to view detailed performance metrics and lead management tools.</p>
            <button className="px-10 py-4 bg-white text-black rounded-2xl font-black text-sm hover:bg-orange-500 hover:text-white transition-all shadow-xl">
              Connect Data Source
            </button>
        </div>

      </main>
    </div>
  );
};

export default DashboardPage;
