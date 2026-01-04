"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Lead } from "@/lib/types";

interface LeadStatusChartProps {
  leads: Lead[];
}

export function LeadStatusChart({ leads }: LeadStatusChartProps) {
  const data = [
    { name: "New", total: leads.filter((l) => l.status === "New").length, fill: "var(--color-new)" },
    { name: "Hot", total: leads.filter((l) => l.status === "Hot").length, fill: "var(--color-hot)" },
    { name: "Cold", total: leads.filter((l) => l.status === "Cold").length, fill: "var(--color-cold)" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Status</CardTitle>
        <CardDescription>A breakdown of your current leads.</CardDescription>
      </CardHeader>
      <CardContent>
        <style>
          {`
            :root {
              --color-new: hsl(210 90% 50%);
              --color-hot: hsl(0 80% 55%);
              --color-cold: hsl(240 50% 70%);
            }
            .dark {
              --color-new: hsl(210 90% 60%);
              --color-hot: hsl(0 80% 65%);
              --color-cold: hsl(240 50% 80%);
            }
          `}
        </style>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
