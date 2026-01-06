
'use client';

import { useRouter } from 'next/navigation';
import { dashboardLeads, agents, properties } from "@/lib/data";
import { LeadStatusChart } from "@/components/dashboard/lead-status-chart";
import { AgentPerformanceTable } from "@/components/dashboard/agent-performance-table";
import { RemindersCard } from "@/components/dashboard/reminders-card";
import { ActionsCard } from "@/components/dashboard/actions-card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DollarSign, Users, Activity } from 'lucide-react';


export default function DashboardPage() {
  const router = useRouter();

  const handlePrimaryClick = () => {
    router.push('/leads');
  };

  const handleSecondaryClick = () => {
    router.push('/tours');
  };

  return (
    <div className="space-y-6">
       <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Welcome to PropCall 360
        </h1>
        <p className="text-muted-foreground">
          Here's a snapshot of your real estate activities.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Revenue"
          value="$0"
          icon={DollarSign}
          description="0% from last month"
        />
        <StatsCard
          title="Active Leads"
          value="0"
          icon={Users}
          description="0% from last month"
        />
        <StatsCard
          title="Follow-ups"
          value="0"
          icon={Activity}
          description="0% from last month"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <LeadStatusChart leads={dashboardLeads} />
        </div>
        <div className="xl:col-span-2">
          <RemindersCard leads={dashboardLeads} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AgentPerformanceTable agents={agents} />
        <ActionsCard properties={properties} />
      </div>
    </div>
  );
}
