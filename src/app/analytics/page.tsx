
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, TrendingUp, Cpu, Activity, Users, LineChart } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const leadScoreData = [
  { name: 'Aarav Sharma', property: 'The Imperial', score: 92, status: 'High Probability' },
  { name: 'Diya Patel', property: 'Greenwood Heights', score: 78, status: 'Warm' },
  { name: 'Rohan Mehta', property: 'Oceanic View', score: 65, status: 'Warm' },
  { name: 'Isha Verma', property: 'Skyline Towers', score: 45, status: 'Cold' },
  { name: 'Vikram Singh', property: 'Azure Bay', score: 95, status: 'High Probability' },
];

const monthlySalesData = [
  { month: 'Jan', sales: 65000 },
  { month: 'Feb', sales: 59000 },
  { month: 'Mar', sales: 80000 },
  { month: 'Apr', sales: 81000 },
  { month: 'May', sales: 56000 },
  { month: 'Jun', sales: 95000 },
];

const statusStyles: { [key: string]: string } = {
  'High Probability': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Warm': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Cold': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};


export default function AnalyticsPage() {
  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          AI Analytics Hub
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Deep insights into your real estate business, powered by AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue Prediction</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4.8M</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month's forecast
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lead Conversion Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Based on AI scoring model
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
            <LineChart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bullish</div>
            <p className="text-xs text-muted-foreground">
              Positive trends detected in your area
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>AI-Powered Lead Scoring</CardTitle>
            <CardDescription>Leads ranked by their conversion probability.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>AI Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Property Interest</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadScoreData.map((lead) => (
                  <TableRow key={lead.name}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                            {lead.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{lead.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-lg text-foreground">{lead.score}</TableCell>
                    <TableCell>
                      <Badge className={statusStyles[lead.status] || ''}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{lead.property}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Sales Growth</CardTitle>
            <CardDescription>AI forecast vs. actual sales.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`}/>
                <Tooltip
                  cursor={{ fill: 'hsl(var(--accent))', opacity: 0.5 }}
                  contentStyle={{
                    background: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
