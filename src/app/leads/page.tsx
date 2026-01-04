
'use client';

import { useState, useMemo } from 'react';
import { leads } from '@/lib/data';
import type { Lead } from '@/lib/types';
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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const statusStyles: Record<Lead['status'], string> = {
  New: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
  Contacted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30',
  Closed: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30',
};

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'All' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">
          Leads Management
        </h1>
        <p className="text-muted-foreground">
          View, filter, and manage all your prospective clients.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div>
              <CardTitle>All Leads</CardTitle>
              <CardDescription>{leads.length} total leads</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Search by name, email, property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
              <Select onValueChange={setStatusFilter} defaultValue="All">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Property Interested</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="transition-colors hover:bg-muted/50">
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </a>
                       <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>{lead.propertyName}</TableCell>
                  <TableCell className="text-right">{formatCurrency(lead.budget)}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={statusStyles[lead.status]}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Change Status</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">Delete Lead</DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {filteredLeads.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No leads found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
