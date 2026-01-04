"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import type { Agent } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


interface AgentPerformanceTableProps {
  agents: Agent[];
}

export function AgentPerformanceTable({ agents }: AgentPerformanceTableProps) {
  const { toast } = useToast();

  const handleCall = (agentName: string) => {
    toast({
      title: "Initiating Cloud Call",
      description: `Connecting ${agentName} to client... The client's number is masked.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Performance</CardTitle>
        <CardDescription>
          Track agent activities and initiate secure calls.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead className="text-center">Calls Made</TableHead>
              <TableHead className="text-center">Call Duration</TableHead>
              <TableHead className="text-center">Virtual Tours</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                      <AvatarFallback>{agent.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{agent.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{agent.calls}</TableCell>
                <TableCell className="text-center">{agent.callDuration} min</TableCell>
                <TableCell className="text-center">{agent.toursGiven}</TableCell>
                <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Phone className="mr-2 h-4 w-4" />
                          Call Client
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Anti-Leakage Cloud Call</AlertDialogTitle>
                          <AlertDialogDescription>
                            You are about to call a client. Their real number will be masked to protect data privacy. The call will be recorded for quality assurance.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleCall(agent.name)}>
                            Proceed to Call
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
