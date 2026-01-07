
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum CommuteType {
  OFFICE = 'office',
  HOME = 'home',
  HYBRID = 'hybrid'
}

export enum TransportMode {
  CAR = 'car',
  PUBLIC = 'public',
  BIKE = 'bike',
  WALK = 'walk'
}

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface Route {
  id: string;
  name: string;
  origin: Location;
  destination: Location;
  waypoints?: Location[]; // Added support for multiple intermediate stops
  isActive: boolean;
  time: string;
}

export interface Alert {
  id: string;
  type: 'weather' | 'traffic' | 'events';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
  read: boolean;
}

export interface CommuteEntry {
  id: string;
  date: string;
  type: CommuteType;
  mode: TransportMode;
  distance: number;
  cost: number;
  duration: number;
}

export interface UserProfile {
  name: string;
  points: number;
  level: number;
  onboardingCompleted: boolean;
}
