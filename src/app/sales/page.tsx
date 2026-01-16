
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Users, DollarSign, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

const pipelineData = {
  'New Lead': [
    { id: 'deal-1', clientName: 'Aarav Sharma', propertyName: 'The Imperial', budget: '7.5 Cr', agent: 'Raj P.' },
    { id: 'deal-2', clientName: 'Diya Patel', propertyName: 'Greenwood Heights', budget: '5.2 Cr', agent: 'Priya S.' },
  ],
  'Contacted': [
    { id: 'deal-3', clientName: 'Rohan Mehta', propertyName: 'Oceanic View', budget: '12 Cr', agent: 'Raj P.' },
  ],
  'Site Visit Done': [
    { id: 'deal-4', clientName: 'Isha Verma', propertyName: 'Skyline Towers', budget: '8 Cr', agent: 'Amit S.' },
    { id: 'deal-5', clientName: 'Vikram Singh', propertyName: 'Azure Bay', budget: '9.5 Cr', agent: 'Priya S.' },
    { id: 'deal-6', clientName: 'Anika Reddy', propertyName: 'The Imperial', budget: '7.8 Cr', agent: 'Raj P.' },
  ],
  'Closing': [
    { id: 'deal-7', clientName: 'Siddharth Joshi', propertyName: 'Greenwood Heights', budget: '5.5 Cr', agent: 'Amit S.' },
  ],
};

const columnStyles = {
  'New Lead': { icon: Plus, color: 'text-blue-400', bg: 'bg-blue-900/20' },
  'Contacted': { icon: Users, color: 'text-orange-400', bg: 'bg-orange-900/20' },
  'Site Visit Done': { icon: Building, color: 'text-purple-400', bg: 'bg-purple-900/20' },
  'Closing': { icon: DollarSign, color: 'text-green-400', bg: 'bg-green-900/20' },
};

const DealCard = ({ deal }: { deal: (typeof pipelineData)['New Lead'][0] }) => (
  <Card className="bg-card-foreground/5 shadow-md hover:border-primary/80 transition-all duration-300 cursor-grab active:cursor-grabbing hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
    <CardHeader className="p-4">
      <CardTitle className="text-base font-semibold text-foreground">{deal.propertyName}</CardTitle>
      <p className="text-sm text-muted-foreground">{deal.clientName}</p>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <Badge variant="secondary" className="text-sm font-bold bg-primary/10 text-primary border-primary/20">
        {deal.budget}
      </Badge>
    </CardContent>
    <CardFooter className="p-4 pt-0 flex justify-end">
       <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-muted text-muted-foreground">{deal.agent.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{deal.agent}</span>
       </div>
    </CardFooter>
  </Card>
);

const PipelineColumn = ({ title, deals }: { title: keyof typeof pipelineData, deals: (typeof pipelineData)['New Lead'] }) => {
  const { icon: Icon, color, bg } = columnStyles[title];

  return (
    <div className={`flex flex-col flex-1 min-w-[300px] rounded-xl ${bg}`}>
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
          <h2 className={`font-semibold ${color}`}>{title}</h2>
        </div>
        <Badge variant="secondary" className="bg-background text-foreground">{deals.length}</Badge>
      </div>
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {deals.map(deal => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
       <div className="p-4 mt-auto">
        <Button variant="ghost" className="w-full h-9 text-muted-foreground hover:bg-card/50 hover:text-foreground">
          <Plus className="h-4 w-4 mr-2"/>
          Add Deal
        </Button>
      </div>
    </div>
  );
};


export default function SalesPage() {
  return (
    <div className="h-full flex flex-col">
       <div className="space-y-2 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Sales Pipeline
        </h1>
        <p className="text-muted-foreground">
          Drag and drop deals to move them across stages.
        </p>
      </div>
      
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {(Object.keys(pipelineData) as Array<keyof typeof pipelineData>).map(title => (
          <PipelineColumn key={title} title={title} deals={pipelineData[title]} />
        ))}
      </div>
    </div>
  );
}
