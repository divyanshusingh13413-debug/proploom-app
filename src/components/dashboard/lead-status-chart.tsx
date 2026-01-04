"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Lead } from "@/lib/types";

interface LeadStatusChartProps {
  leads: Lead[];
}

export function LeadStatusChart({ leads }: LeadStatusChartProps) {
  const data = [
    { name: "New", total: leads.filter((l) => l.status === "New").length, fill: "hsl(var(--primary))" },
    { name: "Hot", total: leads.filter((l) => l.status === "Hot").length, fill: "hsl(var(--accent))" },
    { name: "Cold", total: leads.filter((l) => l.status === "Cold").length, fill: "hsl(var(--secondary))" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Status</CardTitle>
        <CardDescription>A breakdown of your current leads.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--foreground))'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              cursor={{fill: 'hsla(var(--card-foreground), 0.1)'}}
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
