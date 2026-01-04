'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  MoreHorizontal,
  ChevronRight,
  Share2,
  Copy,
  BedDouble,
  Bath,
  Maximize,
  Heart,
  MessageSquare,
  Home,
  MapPin,
  Camera,
  Layers,
  Phone,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const property = {
  name: 'Oceanic View Penthouse',
  imageUrl:
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
  floorPlanUrl:
    'https://picsum.photos/seed/floorplan/400/400',
  agent: {
    name: 'Ananya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
  },
  stats: {
    area: 3200,
    beds: 4,
    baths: 5,
    score: 92,
  },
  tourHotspots: [
    { id: 1, x: '25%', y: '50%', name: 'Living Room' },
    { id: 2, x: '70%', y: '65%', name: 'Dining Area' },
    { id: 3, x: '50%', y: '30%', name: 'Window View' },
    { id: 4, x: '85%', y: '45%', name: 'Kitchenette' },
  ],
};

const VirtualTourHotspot = ({ x, y, name } : {x:string, y:string, name:string}) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <button className="absolute w-6 h-6 rounded-full bg-primary/50 border-2 border-primary ring-4 ring-primary/20 animate-pulse" style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}>
                     <span className="absolute inset-0 w-full h-full bg-primary rounded-full animate-ping opacity-75"></span>
                </button>
            </TooltipTrigger>
            <TooltipContent>
                <p className="flex items-center gap-2"><Home className="w-4 h-4"/> {name}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
)


export default function VirtualTourPage() {
  const [tourProgress, setTourProgress] = useState(35);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">
            Virtual Property Tour
          </h1>
          <p className="text-muted-foreground">
            Explore properties with an immersive 360° experience.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Tour Viewer */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
                 <CardContent className="p-0 relative">
                    <Image
                        src={property.imageUrl}
                        alt="Virtual tour of property"
                        width={1200}
                        height={700}
                        className="object-cover w-full aspect-[16/9]"
                        data-ai-hint="luxury penthouse interior"
                    />
                    {property.tourHotspots.map(spot => (
                         <VirtualTourHotspot key={spot.id} x={spot.x} y={spot.y} name={spot.name} />
                    ))}
                    <div className="absolute bottom-4 left-4 right-4">
                        <Progress value={tourProgress} className="h-2" />
                        <div className="flex justify-between text-xs text-white/70 mt-1">
                            <span>Living Room</span>
                            <span>{tourProgress}% complete</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl">{property.name}</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon"><Heart className="w-5 h-5"/></Button>
                        <Button variant="ghost" size="icon"><Share2 className="w-5 h-5"/></Button>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 p-4 bg-muted rounded-lg">
                        <Layers className="w-6 h-6 text-primary"/>
                        <span className="font-bold text-lg">{property.stats.area}</span>
                        <span className="text-xs text-muted-foreground">Sq. Ft.</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 p-4 bg-muted rounded-lg">
                        <BedDouble className="w-6 h-6 text-primary"/>
                        <span className="font-bold text-lg">{property.stats.beds}</span>
                        <span className="text-xs text-muted-foreground">Bedrooms</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 p-4 bg-muted rounded-lg">
                        <Bath className="w-6 h-6 text-primary"/>
                        <span className="font-bold text-lg">{property.stats.baths}</span>
                        <span className="text-xs text-muted-foreground">Bathrooms</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 p-4 bg-muted rounded-lg">
                        <Badge variant="outline" className="text-lg font-bold border-accent text-accent">{property.stats.score}</Badge>
                        <span className="text-xs text-muted-foreground">AI Score</span>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Virtual Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-primary">
                            <AvatarImage src={property.agent.avatarUrl} alt={property.agent.name} data-ai-hint="woman portrait" />
                            <AvatarFallback>{property.agent.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{property.agent.name}</p>
                            <p className="text-sm text-muted-foreground">Assigned Agent</p>
                        </div>
                    </div>

                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-start gap-3">
                            <Camera className="w-4 h-4 mt-1 text-primary shrink-0"/>
                            <span>Entry & Foyer - Modern design with city views.</span>
                        </li>
                         <li className="flex items-start gap-3">
                            <Camera className="w-4 h-4 mt-1 text-primary shrink-0"/>
                            <span>Living Area - Spacious, open-concept with smart lighting.</span>
                        </li>
                         <li className="flex items-start gap-3">
                            <Camera className="w-4 h-4 mt-1 text-primary shrink-0"/>
                            <span>Kitchen - Fully equipped with high-end appliances.</span>
                        </li>
                    </ul>
                    <Button className="w-full bg-secondary hover:bg-secondary/90">
                        <Phone className="w-4 h-4 mr-2"/>
                        Live Chat with Agent
                    </Button>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>Floor Plan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="aspect-square rounded-lg overflow-hidden relative">
                         <Image
                            src={property.floorPlanUrl}
                            alt="Property floor plan"
                            fill
                            className="object-cover"
                            data-ai-hint="architectural floor plan"
                        />
                        <div className="absolute bottom-2 right-2 flex gap-2">
                           <Button size="icon" variant="outline" className="bg-background/50 backdrop-blur-sm border-0">
                                <Maximize className="w-4 h-4"/>
                           </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
