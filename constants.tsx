
import React from 'react';
import { 
  CloudRain, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Settings, 
  Home, 
  User,
  Zap,
  Navigation,
  Activity,
  Award
} from 'lucide-react';
import { Alert, RiskLevel, CommuteType, TransportMode } from './types';

export const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    type: 'traffic',
    title: 'Congestion on Ave. Paulista',
    description: 'Heavy traffic detected due to a broken down vehicle near MASP.',
    severity: 'high',
    createdAt: new Date().toISOString(),
    read: false
  },
  {
    id: '2',
    type: 'weather',
    title: 'Rain Warning',
    description: 'Moderate rain expected between 5 PM and 7 PM.',
    severity: 'medium',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    read: true
  }
];

export const APP_THEME = {
  primary: '#3b82f6',
  secondary: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  bg: '#f3f4f6',
  surface: '#ffffff',
  text: '#1f2937'
};

export const NAVIGATION_ITEMS = [
  { label: 'Home', icon: <Home size={24} />, path: '/' },
  { label: 'Routes', icon: <Navigation size={24} />, path: '/routes' },
  { label: 'Mobility', icon: <Activity size={24} />, path: '/mobility' },
  { label: 'Alerts', icon: <Zap size={24} />, path: '/alerts' },
  { label: 'Profile', icon: <User size={24} />, path: '/profile' }
];
