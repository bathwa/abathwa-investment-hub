
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CircularProgress } from '@/components/CircularProgress';
import { GlassCard } from '@/components/GlassCard';
import { ServiceRequestsList } from '@/components/services/ServiceRequestsList';
import { JobCardsList } from '@/components/services/JobCardsList';
import { 
  ArrowLeft, 
  Plus, 
  Activity, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Settings,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServiceManagement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button size="icon" variant="ghost" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Service Management</h1>
              <p className="text-slate-400">Manage your services and job cards</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" className="rounded-full">
              <Filter className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-5 w-5 text-blue-400" />
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Active
                </Badge>
              </div>
              <div className="text-2xl font-bold mb-1">12</div>
              <p className="text-sm text-slate-400">Total Services</p>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  Pending
                </Badge>
              </div>
              <div className="text-2xl font-bold mb-1">5</div>
              <p className="text-sm text-slate-400">In Progress</p>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                  Done
                </Badge>
              </div>
              <div className="text-2xl font-bold mb-1">8</div>
              <p className="text-sm text-slate-400">Completed</p>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">
                  Issues
                </Badge>
              </div>
              <div className="text-2xl font-bold mb-1">2</div>
              <p className="text-sm text-slate-400">Need Attention</p>
            </CardContent>
          </GlassCard>
        </div>

        {/* Progress Overview */}
        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Overall Progress</span>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Service
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-6">
              <CircularProgress value={72} size={150} className="text-blue-500">
                <div className="text-center">
                  <div className="text-3xl font-bold">72%</div>
                  <div className="text-sm text-slate-400">Complete</div>
                </div>
              </CircularProgress>
            </div>
          </CardContent>
        </GlassCard>

        {/* Service Requests */}
        <GlassCard>
          <CardHeader>
            <CardTitle>Service Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceRequestsList />
          </CardContent>
        </GlassCard>

        {/* Job Cards */}
        <GlassCard>
          <CardHeader>
            <CardTitle>Job Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <JobCardsList />
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
