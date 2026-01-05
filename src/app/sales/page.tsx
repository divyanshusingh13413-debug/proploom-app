'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, DollarSign, Target, Hash, ChevronRight } from 'lucide-react';
import { deals } from '@/lib/data';
import type { Deal } from '@/lib/types';

const StatsCard = ({ title, value, color, icon: Icon }: { title: string, value: string, color: string, icon: React.ElementType }) => (
    <Card className={`bg-gradient-to-br ${color} text-white`}>
        <CardHeader>
            <CardDescription className="text-white/80">{title}</CardDescription>
            <CardTitle className="text-4xl font-bold flex justify-between items-center">
                {value}
                <Icon className="w-8 h-8 opacity-50" />
            </CardTitle>
        </CardHeader>
    </Card>
);

const statusStyles: Record<string, string> = {
  New: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30',
  Negotiation: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30',
  Closed: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
};


export default function SalesPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">
            Sales Pipeline & Closure
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="TOTAL REVENUE" value="$5.2M" color="from-green-500 to-green-700" icon={DollarSign} />
        <StatsCard title="DEALS CLOSED THIS MONTH" value="18" color="from-orange-500 to-orange-700" icon={Target} />
        <StatsCard title="AVERAGE DEAL SIZE" value="$289K" color="from-purple-500 to-purple-700" icon={Hash} />
      </div>

      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Active Deals & Opportunities</CardTitle>
                <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Client Name</TableHead>
                        <TableHead>Deal Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Deal Value</TableHead>
                        <TableHead>Agent</TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead className="text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {deals.map((deal) => (
                         <TableRow key={deal.id}>
                            <TableCell className="font-medium">{deal.clientName}</TableCell>
                            <TableCell>{deal.dealName}</TableCell>
                            <TableCell><Badge className={statusStyles[deal.status]}>{deal.status}</Badge></TableCell>
                            <TableCell>${deal.dealValue}</TableCell>
                            <TableCell>{`Agent ${deal.agentId.split('-')[1]}`}</TableCell>
                            <TableCell>{deal.lastActivity}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </Button>
                            </TableCell>
                         </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
