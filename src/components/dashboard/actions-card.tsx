"use client";

import { useState } from "react";
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateWhatsappMessage } from "@/ai/flows/generate-whatsapp-message";
import { MessageSquare, Video, Sparkles, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Property } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ActionsCardProps {
  properties: Property[];
}

export function ActionsCard({ properties }: ActionsCardProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [leadName, setLeadName] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);

  const handleGenerateMessage = async () => {
    if (!leadName || !selectedPropertyId) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a lead name and select a property.",
      });
      return;
    }
    const property = properties.find(p => p.id === selectedPropertyId);
    if (!property) return;

    setIsGenerating(true);
    setGeneratedMessage("");
    try {
      const result = await generateWhatsappMessage({
        leadName: leadName,
        propertyName: property.name,
        propertyBrochureUrl: property.brochureUrl,
        leadSource: 'New Inquiry',
      });
      setGeneratedMessage(result.message);
    } catch (error) {
      console.error("Failed to generate message", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate WhatsApp message.",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const resetWhatsappForm = () => {
    setLeadName("");
    setSelectedPropertyId(undefined);
    setGeneratedMessage("");
  }

  return (
    <Card className="flex flex-col sm:flex-row items-center justify-between p-6">
        <div>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Automate tasks and showcase properties.</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Dialog open={whatsappDialogOpen} onOpenChange={(open) => { if(!open) resetWhatsappForm(); setWhatsappDialogOpen(open); }}>
            <DialogTrigger asChild>
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                WhatsApp Bot
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>WhatsApp Automation Bot</DialogTitle>
                <DialogDescription>
                  Generate a personalized welcome message and brochure link for a new lead.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Lead Name</Label>
                  <Input id="name" value={leadName} onChange={(e) => setLeadName(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="property" className="text-right">Property</Label>
                  <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {generatedMessage && (
                    <div className="col-span-4 rounded-md border bg-muted/50 p-3 text-sm">
                        {generatedMessage}
                    </div>
                )}
              </div>
              <DialogFooter>
                {generatedMessage ? (
                    <DialogClose asChild>
                        <Button className="bg-secondary hover:bg-secondary/90">
                            <Send className="mr-2 h-4 w-4"/>
                            Send Message
                        </Button>
                    </DialogClose>
                ) : (
                    <Button onClick={handleGenerateMessage} disabled={isGenerating} variant="outline">
                      {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-accent" />}
                      Generate Message
                    </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
