
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, CheckCircle, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

const upcomingVisitsData = [
  {
    id: 1,
    agentName: 'Raj Patel',
    agentInitial: 'RP',
    clientName: 'Aarav Sharma',
    property: 'The Imperial, Mumbai',
    status: 'En Route',
    statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  {
    id: 2,
    agentName: 'Priya Sharma',
    agentInitial: 'PS',
    clientName: 'Diya Patel',
    property: 'Greenwood Heights, Delhi',
    status: 'Arrived',
    statusColor: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  {
    id: 3,
    agentName: 'Amit Singh',
    agentInitial: 'AS',
    clientName: 'Rohan Mehta',
    property: 'Oceanic View, Goa',
    status: 'Starting Soon',
    statusColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
   {
    id: 4,
    agentName: 'Raj Patel',
    agentInitial: 'RP',
    clientName: 'Isha Verma',
    property: 'Skyline Towers, Bangalore',
    status: 'Delayed',
    statusColor: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
];

export default function SiteVisitPage() {
  const [verifiedVisits, setVerifiedVisits] = useState<number[]>([]);

  const handleVerifyVisit = (visitId: number) => {
    setVerifiedVisits(prev => 
      prev.includes(visitId) ? prev.filter(id => id !== visitId) : [...prev, visitId]
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Site Visit Tracker
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Monitor your agents' site visits in real-time and verify their completion.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Site Visits List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Site Visits</CardTitle>
              <CardDescription>A summary of scheduled client visits for today.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Client & Property</TableHead>
                    <TableHead>GPS Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingVisitsData.map((visit) => {
                    const isVerified = verifiedVisits.includes(visit.id);
                    return (
                      <TableRow key={visit.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                                {visit.agentInitial}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{visit.agentName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-foreground">{visit.clientName}</div>
                          <div className="text-sm text-muted-foreground">{visit.property}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("whitespace-nowrap", visit.statusColor)}>{visit.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant={isVerified ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleVerifyVisit(visit.id)}
                            className={cn(
                                "transition-all w-[120px]",
                                isVerified && 'bg-green-600 hover:bg-green-700 text-white'
                            )}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {isVerified ? 'Verified' : 'Verify Visit'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Map Placeholder */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Today's Visit Locations</CardTitle>
              <CardDescription>Live map of agent locations.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square w-full bg-muted rounded-lg flex items-center justify-center relative overflow-hidden border border-border">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] opacity-50"></div>
                 <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background"></div>
                <div className="text-center z-10 p-4">
                    <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="font-bold text-lg text-foreground">Map View Unavailable</p>
                    <p className="text-sm text-muted-foreground">GPS integration is pending.</p>
                </div>
                {/* Mock pins */}
                <Navigation className="h-6 w-6 text-blue-400 absolute top-[20%] left-[30%] -rotate-45" />
                <Navigation className="h-6 w-6 text-green-400 absolute bottom-[30%] right-[25%]" />
                 <Navigation className="h-6 w-6 text-yellow-400 absolute top-[40%] right-[15%] rotate-90" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
