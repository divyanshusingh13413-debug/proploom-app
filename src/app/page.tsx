import { Users, TrendingUp, PhoneCall, Video } from "lucide-react";
import { leads, agents, properties } from "@/lib/data";
import { StatsCard } from "@/components/dashboard/stats-card";
import { LeadStatusChart } from "@/components/dashboard/lead-status-chart";
import { AgentPerformanceTable } from "@/components/dashboard/agent-performance-table";
import { RemindersCard } from "@/components/dashboard/reminders-card";
import { ActionsCard } from "@/components/dashboard/actions-card";

export default function DashboardPage() {
  const hotLeads = leads.filter(l => l.status === 'Hot').length;
  const coldLeads = leads.filter(l => l.status === 'Cold').length;
  const totalCalls = agents.reduce((acc, agent) => acc + agent.calls, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's a real-time overview of your agency.
          </p>
        </div>
      </div>
      
      <ActionsCard properties={properties} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Leads"
          value={leads.length.toString()}
          icon={Users}
          description={`${hotLeads} hot, ${coldLeads} cold`}
        />
        <StatsCard
          title="Hot Leads"
          value={hotLeads.toString()}
          icon={TrendingUp}
          description="High-priority prospects"
        />
        <StatsCard
          title="Total Calls"
          value={totalCalls.toString()}
          icon={PhoneCall}
          description="Across all agents today"
        />
        <StatsCard
          title="Tours Presented"
          value={agents.reduce((acc, agent) => acc + agent.toursGiven, 0).toString()}
          icon={Video}
          description="Virtual tours shown"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <LeadStatusChart leads={leads} />
        </div>
        <div className="xl:col-span-2">
          <RemindersCard leads={leads} />
        </div>
      </div>

      <AgentPerformanceTable agents={agents} />
    </div>
  );
}
