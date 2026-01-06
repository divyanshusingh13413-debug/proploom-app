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
import { Progress } from "@/components/ui/progress";
import type { Agent } from "@/lib/types";

interface AgentPerformanceTableProps {
  agents: Agent[];
}

export function AgentPerformanceTable({ agents }: AgentPerformanceTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Performance</CardTitle>
        <CardDescription>
          Track agent activities and performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead className="text-center">Deals</TableHead>
              <TableHead className="text-center">Success Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={agent.avatarUrl} alt={`Agent ${agent.id}`} />
                      <AvatarFallback>{agent.id.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{`Agent ${agent.id.split('-')[1]}`}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{agent.deals}</TableCell>
                <TableCell className="text-center">
                    <div className="flex items-center gap-2">
                        <Progress value={agent.successRate} className="h-2" />
                        <span className="text-xs text-muted-foreground">{agent.successRate}%</span>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
