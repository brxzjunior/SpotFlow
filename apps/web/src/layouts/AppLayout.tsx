import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  Sparkles,
  Music,
  Workflow,
  BarChart2,
  Bot,
  Settings,
  LayoutDashboard,
  ExternalLink,
  Radio
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/app/studio', label: 'AI Playlist Studio', icon: Sparkles },
  { to: '/app/library', label: 'Music Organizer', icon: Music },
  { to: '/app/automations', label: 'Automation Center', icon: Workflow },
  { to: '/app/insights', label: 'Listening Insights', icon: BarChart2 },
  { to: '/app/copilot', label: 'Music Copilot', icon: Bot },
  { to: '/app/settings', label: 'Configurações', icon: Settings },
];

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-charcoal-950 text-slate-100">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-charcoal-800 bg-charcoal-900/90 backdrop-blur-md p-4">
        {/* Brand */}
        <Link to="/app" className="flex items-center gap-2.5 px-2 py-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-flowgreen-400 to-flowgreen-600 flex items-center justify-center shadow-lg shadow-flowgreen-600/20">
            <Radio className="w-5 h-5 text-charcoal-950 font-bold" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white">SpotFlow <span className="text-flowgreen-400">AI</span></span>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Music Orchestrator</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-charcoal-800 text-flowgreen-400 shadow-sm border border-charcoal-700/60 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-charcoal-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Spotify Status Pill */}
        <div className="p-3 rounded-xl bg-charcoal-850 border border-charcoal-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs text-slate-300 font-medium">Spotify Desconectado</span>
          </div>
          <Link
            to="/app/settings"
            className="text-[11px] text-flowgreen-400 hover:underline flex items-center gap-0.5"
          >
            Conectar <ExternalLink className="w-2.5 h-2.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between border-b border-charcoal-800 bg-charcoal-900 px-4 py-3">
          <Link to="/app" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-flowgreen-400 to-flowgreen-600 flex items-center justify-center">
              <Radio className="w-4 h-4 text-charcoal-950 font-bold" />
            </div>
            <span className="font-extrabold text-sm text-white">SpotFlow AI</span>
          </Link>
          <Link
            to="/app/settings"
            className="text-xs bg-charcoal-800 px-2.5 py-1.5 rounded-lg text-slate-300 border border-charcoal-700"
          >
            Configurações
          </Link>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto bg-charcoal-950 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden flex items-center justify-around border-t border-charcoal-800 bg-charcoal-900 py-2 px-1">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 p-2 text-[10px] font-medium transition-colors ${
                    isActive ? 'text-flowgreen-400' : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label.split(' ')[0]}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
