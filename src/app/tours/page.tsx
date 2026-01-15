
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VirtualTourPage() {
  const [tours, setTours] = useState<{ name: string, location: string, image: string }[]>([]);
  const [newTourName, setNewTourName] = useState('');
  const [newTourLocation, setNewTourLocation] = useState('');
  const [newTourImage, setNewTourImage] = useState<File | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateTour = () => {
    if (newTourName && newTourLocation && newTourImage) {
      const newTour = {
        name: newTourName,
        location: newTourLocation,
        image: URL.createObjectURL(newTourImage),
      };
      setTours([...tours, newTour]);
      // Reset form
      setNewTourName('');
      setNewTourLocation('');
      setNewTourImage(null);
      setDialogOpen(false);
    }
  };

  const handleRemoveTour = (indexToRemove: number) => {
    setTours(tours.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Site Visits & Virtual Tours
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Manage and showcase your 360° virtual property tours. This page is currently a placeholder.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-xl border-muted-foreground/50 text-muted-foreground hover:border-primary hover:text-primary transition-colors bg-card-foreground/5">
              <Plus className="w-12 h-12 mb-2" />
              <span className="font-medium">Add New Tour</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Virtual Tour</DialogTitle>
              <DialogDescription>
                Upload a panorama image and provide details for your new tour.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tour-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="tour-name"
                  value={newTourName}
                  onChange={(e) => setNewTourName(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., 'The Imperial Penthouse'"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tour-location" className="text-right">
                  Location
                </Label>
                <Input
                  id="tour-location"
                  value={newTourLocation}
                  onChange={(e) => setNewTourLocation(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., 'Mumbai, India'"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tour-image" className="text-right">
                  Image
                </Label>
                <Input
                  id="tour-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setNewTourImage(e.target.files[0])}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateTour}>Create Tour</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {tours.map((tour, index) => (
          <Card key={index} className="overflow-hidden group relative transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
             <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveTour(index)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove tour</span>
              </Button>
             <div className="overflow-hidden aspect-video relative">
                <Image
                    src={tour.image}
                    alt={`Virtual tour of ${tour.name}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
             </div>
             <CardHeader>
                <CardTitle className="text-base">{tour.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{tour.location}</p>
             </CardHeader>
          </Card>
        ))}
         {tours.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center text-center text-muted-foreground h-full py-16 border-2 border-dashed rounded-lg">
                <Video className="h-12 w-12 mb-4 text-muted-foreground/50"/>
                <p className="font-medium">No Virtual Tours</p>
                <p className="text-sm">Click 'Add New Tour' to upload your first one.</p>
            </div>
         )}
      </div>
    </div>
  );
}
