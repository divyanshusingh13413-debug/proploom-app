"use client";

import { useState } from "react";
import { generateFollowUpReminder } from "@/ai/flows/generate-follow-up-reminder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bell, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Lead } from "@/lib/types";

interface RemindersCardProps {
  leads: Lead[];
}

export function RemindersCard({ leads }: RemindersCardProps) {
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleGenerateReminder = async (lead: Lead) => {
    setLoading((prev) => ({ ...prev, [lead.id]: true }));
    try {
      const result = await generateFollowUpReminder({
        clientName: `Lead ${lead.id}`,
        propertyViewed: lead.propertyName,
        interactionDate: lead.lastContact,
        agentName: "you", // Assuming the logged-in agent
        clientPreferences: "N/A", // Can be extended
      });
      setReminders((prev) => ({ ...prev, [lead.id]: result.reminderMessage }));
    } catch (error) {
      console.error("Failed to generate reminder:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate reminder. Please try again.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [lead.id]: false }));
    }
  };

  const leadsToRemind = leads.filter(l => l.status !== 'New');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow-up Reminders</CardTitle>
        <CardDescription>AI-powered reminders for your leads.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {leadsToRemind.length > 0 ? leadsToRemind.map((lead, index) => (
              <div key={lead.id}>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {`Follow up with Lead ${lead.id}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Viewed {lead.propertyName} {lead.lastContact}.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateReminder(lead)}
                      disabled={loading[lead.id]}
                    >
                      <Sparkles className="mr-2 h-4 w-4 text-accent" />
                      {loading[lead.id] ? "Generating..." : "Suggest"}
                    </Button>
                  </div>
                  {reminders[lead.id] && (
                    <div className="mt-2 rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground">
                      {reminders[lead.id]}
                    </div>
                  )}
                </div>
                {index < leadsToRemind.length - 1 && <Separator className="my-4" />}
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-10">
                <Bell className="h-10 w-10 mb-2"/>
                <p>No follow-ups needed right now.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
