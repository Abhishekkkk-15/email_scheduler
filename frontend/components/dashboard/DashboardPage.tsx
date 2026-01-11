"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Plus, LogOut, Mail, Clock, HistoryIcon } from "lucide-react";

import ExecutionHistoryDialog from "@/components/history/ExecutionHistoryDialog";

const mockWorkflows = [
  {
    id: "1",
    name: "Welcome Series",
    createdAt: "10 Jan 2024",
    nodes: 4,
  },
  {
    id: "2",
    name: "Product Launch Campaign",
    createdAt: "08 Jan 2024",
    nodes: 6,
  },
  {
    id: "3",
    name: "Re-engagement Flow",
    createdAt: "05 Jan 2024",
    nodes: 5,
  },
];

export default function DashboardPage({ workflows }: { workflows: any }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showHistory, setShowHistory] = useState(false);

  const createNewWorkflow = () => {
    router.push(`/workflow/${Date.now()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ---------- HEADER ---------- */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold leading-none">
              Email Scheduler
            </h1>
            <span className="text-xs text-muted-foreground">
              Welcome back, {session?.user?.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHistory(true)}
              title="Execution history">
              <HistoryIcon className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut()}
              title="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* ---------- MAIN ---------- */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Top section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Your workflows
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage your email automation flows
            </p>
          </div>

          <Button size="lg" onClick={createNewWorkflow}>
            <Plus className="h-4 w-4 mr-2" />
            New workflow
          </Button>
        </div>

        {/* Workflows grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((workflow: any) => (
            <Card
              key={workflow.id}
              //   onClick={() => router.push(`/workflow/${workflow.id}`)}
              className="group cursor-pointer transition hover:border-primary/40">
              <CardHeader className="space-y-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
                  {workflow.name}
                </CardTitle>

                <CardDescription className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {workflow.nodes.length} nodes
                  </span>

                  <span className="text-muted-foreground">
                    Created {workflow.createdAt}
                  </span>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>

      {/* ---------- HISTORY DIALOG ---------- */}
      <ExecutionHistoryDialog
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        logedUser={session?.user!}
      />
    </div>
  );
}
