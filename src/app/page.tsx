
'use client';

import { useRouter } from 'next/navigation';
import Hero from "@/components/ui/animated-shader-hero";
import { dashboardLeads, agents } from "@/lib/data";
import { LeadStatusChart } from "@/components/dashboard/lead-status-chart";
import { AgentPerformanceTable } from "@/components/dashboard/agent-performance-table";
import { RemindersCard } from "@/components/dashboard/reminders-card";

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
      <Hero
        trustBadge={{
          text: "Welcome to PropCall 360",
          icons: ["✨"]
        }}
        headline={{
          line1: "Intelligent Real Estate,",
          line2: "Seamlessly Connected."
        }}
        subtitle="Harness the power of AI with anti-leakage cloud calling, WhatsApp automation, and offline 360° virtual tours. Everything you need, all in one place."
        buttons={{
          primary: {
            text: "View Leads",
            onClick: handlePrimaryClick
          },
          secondary: {
            text: "Explore Virtual Tours",
            onClick: handleSecondaryClick
          }
        }}
        className="-m-4 sm:-m-6"
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5 pt-[calc(100vh-120px)] sm:pt-0">
        <div className="xl:col-span-3">
          <LeadStatusChart leads={dashboardLeads} />
        </div>
        <div className="xl:col-span-2">
          <RemindersCard leads={dashboardLeads} />
        </div>
      </div>

      <AgentPerformanceTable agents={agents} />
    </div>
  );
}
