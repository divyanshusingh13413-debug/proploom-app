"use client";

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import type { Property } from "@/lib/types";
import { Card, CardHeader, CardTitle } from "../ui/card";
import Link from 'next/link';

interface ActionsCardProps {
  properties: Property[];
}

export function ActionsCard({ properties }: ActionsCardProps) {
  
  return (
    <Card className="flex flex-col sm:flex-row items-center justify-between p-6">
        <div>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Automate tasks and showcase properties.</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button asChild>
            <Link href="/whatsapp">
              <Video className="mr-2 h-4 w-4" />
              WhatsApp Bot
            </Link>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Video className="mr-2 h-4 w-4" />
                Virtual Tours
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Offline 360° Virtual Tours</DialogTitle>
                <DialogDescription>
                  High-quality tours available even without network. Click a property to view.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                {properties.map(p => (
                  <Card key={p.id} className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
                    <div className="overflow-hidden">
                      <Image
                        src={p.tourImageUrl}
                        alt={`Virtual tour of ${p.name}`}
                        width={400}
                        height={300}
                        className="object-cover aspect-[4/3] w-full group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint="apartment interior"
                      />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-base">{p.name}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
    </Card>
  );
}
