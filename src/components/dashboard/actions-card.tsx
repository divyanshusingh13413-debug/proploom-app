
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
import { MessageSquare, Video, UserPlus } from "lucide-react";
import type { Property } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from 'next/link';
import { InviteClientDialog } from './invite-client-dialog';
import { leads } from '@/lib/data';

interface ActionsCardProps {
  properties: Property[];
}

export function ActionsCard({ properties }: ActionsCardProps) {
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <p className="text-sm text-muted-foreground">Automate tasks and showcase properties.</p>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/whatsapp">
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              WhatsApp Bot
            </Button>
          </Link>

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

          <InviteClientDialog leads={leads}>
             <Button variant="secondary">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Client
              </Button>
          </InviteClientDialog>
      </CardContent>
    </Card>
  );
}
