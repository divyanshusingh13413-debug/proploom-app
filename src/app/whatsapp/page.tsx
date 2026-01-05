
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateWhatsappMessage } from "@/ai/flows/generate-whatsapp-message";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { properties } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function WhatsappPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [leadName, setLeadName] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();

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

  const handleSend = () => {
    toast({
      title: "Message Sent!",
      description: "Your message has been queued for sending.",
    });
    resetWhatsappForm();
  }

  return (
    <div className="container mx-auto max-w-2xl">
        <Card>
            <CardHeader>
                <CardTitle>WhatsApp Automation Bot</CardTitle>
                <CardDescription>
                  Generate a personalized welcome message and brochure link for a new lead.
                </CardDescription>
            </CardHeader>
            <CardContent>
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
                <div className="flex justify-end gap-2">
                {generatedMessage ? (
                  <DialogClose asChild>
                    <Button onClick={handleSend} className="bg-secondary hover:bg-secondary/90">
                        <>
                            <Send className="mr-2 h-4 w-4"/>
                            Send Message
                        </>
                    </Button>
                  </DialogClose>
                ) : (
                    <Button onClick={handleGenerateMessage} disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-accent" />}
                        Generate Message
                    </Button>
                )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
