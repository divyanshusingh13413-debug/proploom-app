'use client';

import { useState } from 'react';
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
import { Plus } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <h1 className="text-6xl font-black tracking-tighter font-headline">
        Virtual Tour
      </h1>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button className="flex flex-col items-center justify-center w-96 h-64 border-2 border-dashed rounded-lg border-muted-foreground text-muted-foreground hover:border-primary hover:text-primary transition-colors">
            <Plus className="w-16 h-16 mb-4" />
            <span className="text-xl">Add New Tour</span>
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
    </div>
  );
}
