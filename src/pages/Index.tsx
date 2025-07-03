
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Activity, 
  Bell, 
  Settings, 
  User, 
  Calendar, 
  Clock, 
  Star, 
  Circle,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4 text-sm">
        <div className="flex items-center gap-2">
          <span>9:41</span>
        </div>
        <div className="flex items-center gap-1">
          <Signal className="h-4 w-4" />
          <Wifi className="h-4 w-4" />
          <Battery className="h-4 w-4" />
        </div>
      </div>

      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
            <p className="text-slate-400">Welcome back, User</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button size="icon" variant="ghost" className="rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Large Central Circle */}
          <div className="col-span-2 flex justify-center mb-6">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border-4 border-blue-500/30 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
                <div className="w-32 h-32 rounded-full bg-blue-500/20 backdrop-blur-sm flex items-center justify-center">
                  <Activity className="h-12 w-12 text-blue-400" />
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  System Active
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <Card className="glass-card border-slate-700/50 bg-slate-800/40 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                <span className="text-2xl font-bold">12</span>
              </div>
              <p className="text-sm text-slate-400">Tasks Today</p>
              <Progress value={75} className="mt-2 h-1" />
            </CardContent>
          </Card>

          <Card className="glass-card border-slate-700/50 bg-slate-800/40 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-5 w-5 text-green-400" />
                <span className="text-2xl font-bold">8.5h</span>
              </div>
              <p className="text-sm text-slate-400">Work Time</p>
              <Progress value={60} className="mt-2 h-1" />
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <Card className="glass-card border-slate-700/50 bg-slate-800/40 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Service Management</h3>
                  <p className="text-sm text-slate-400">Manage your services and job cards</p>
                </div>
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="flex gap-2">
                <Link to="/services">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Open Services
                  </Button>
                </Link>
                <Button variant="outline" className="border-slate-600 text-slate-300">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-slate-700/50 bg-slate-800/40 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Media Player</h3>
                  <p className="text-sm text-slate-400">Now playing: Ambient Sounds</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Play className="h-6 w-6 text-orange-400" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Pause className="h-4 w-4" />
                </Button>
                <Progress value={45} className="flex-1 h-1" />
                <Button size="icon" variant="ghost" className="rounded-full">
                  <SkipForward className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <Link to="/login">
            <Button 
              variant="ghost" 
              className="h-16 flex-col gap-1 rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm hover:bg-slate-700/50"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Login</span>
            </Button>
          </Link>
          
          <Link to="/signup">
            <Button 
              variant="ghost" 
              className="h-16 flex-col gap-1 rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm hover:bg-slate-700/50"
            >
              <Circle className="h-5 w-5" />
              <span className="text-xs">Sign Up</span>
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            className="h-16 flex-col gap-1 rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm hover:bg-slate-700/50"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="h-16 flex-col gap-1 rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm hover:bg-slate-700/50"
          >
            <Bell className="h-5 w-5" />
            <span className="text-xs">Alerts</span>
          </Button>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-t border-slate-700/50 p-4">
          <div className="flex justify-around items-center max-w-sm mx-auto">
            <Button size="icon" variant="ghost" className="rounded-full">
              <Circle className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full">
              <Activity className="h-5 w-5 text-blue-400" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
