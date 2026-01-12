"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Sparkles,
  Workflow,
  Mail,
  Clock,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedWorkflow } from "./AnimatedWorkflow";

const STATUSES = ["QUEUED", "PROCESSING", "SENT"] as const;

function LiveStatusBadge() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % STATUSES.length),
      1600
    );
    return () => clearInterval(id);
  }, []);

  const status = STATUSES[index];

  const styles: Record<string, string> = {
    QUEUED: "bg-gray-100 text-gray-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SENT: "bg-green-100 text-green-800",
  };

  return (
    <motion.div
      key={status}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}>
      <Badge className={`rounded-full px-3 py-1 ${styles[status]}`}>
        {status}
      </Badge>
    </motion.div>
  );
}

function RFNode({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="relative w-[160px] rounded-md border bg-background shadow-sm">
      {/* Left handle */}
      <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-muted-foreground" />

      {/* Right handle */}
      <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-muted-foreground" />

      <div className="px-3 py-2">
        <p className="text-xs font-semibold">{title}</p>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export function AnimatedWorkflowDrag() {
  return (
    <div className="relative h-[240px] w-full overflow-hidden rounded-xl bg-muted/30 border">
      {/* Cursor */}
      <motion.div
        className="absolute z-20"
        initial={{ x: 40, y: 60 }}
        animate={{
          x: [40, 120, 240, 240],
          y: [60, 60, 120, 120],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}>
        <div className="h-3 w-3 rounded-full bg-black dark:bg-white shadow-md" />
      </motion.div>

      {/* Lead Source */}
      <motion.div
        className="absolute left-8 top-16"
        initial={{ x: 0 }}
        animate={{ x: [0, 0, 100, 100] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}>
        <RFNode title="Lead Source" subtitle="Google Ads" />
      </motion.div>

      {/* Connector */}
      <div className="absolute left-[200px] top-[96px] h-[2px] w-[40px] bg-muted-foreground/40" />

      {/* Wait */}
      <motion.div
        className="absolute left-56 top-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 1] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}>
        <RFNode title="Wait" subtitle="10 seconds" />
      </motion.div>

      {/* Connector */}
      <div className="absolute left-[380px] top-[96px] h-[2px] w-[40px] bg-muted-foreground/40" />

      {/* Cold Email */}
      <motion.div
        className="absolute left-[430px] top-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}>
        <RFNode title="Cold Email" subtitle="Welcome email" />
      </motion.div>
    </div>
  );
}

export default function HeroPage() {
  return (
    <div className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)]" />

      <section className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        {/* -------- Hero Text -------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center">
          <Badge className="mb-4" variant="default">
            <Sparkles className="h-3 w-3 mr-1" />
            Workflow-driven Email Automation
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Build. Schedule. <span className="text-primary">Automate</span>{" "}
            Emails
          </h1>

          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto text-lg">
            Design powerful email workflows with live execution tracking,
            delays, follow-ups and real-time status updates.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature
            icon={<Workflow />}
            title="Visual Workflow Builder"
            desc="Drag-and-drop nodes like Lead Source, Wait, Cold Email and Follow-ups."
          />
          <Feature
            icon={<Mail />}
            title="Template-based Emails"
            desc="Reusable email templates with variables and live preview."
          />
          <Feature
            icon={<Clock />}
            title="Smart Scheduling"
            desc="Delays, sequencing and follow-ups handled automatically."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-28 rounded-2xl border bg-muted/40 p-6 shadow-xl">
          <div className="rounded-xl bg-background border p-6 space-y-4">
            <AnimatedWorkflow />

            <div className="flex items-center justify-center gap-3 pt-2">
              <span className="text-sm text-muted-foreground">
                Execution Status
              </span>
              <LiveStatusBadge />
            </div>
          </div>
        </motion.div>

        <div className="mt-32">
          <h2 className="text-3xl font-bold text-center">How it works</h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Step
              icon={<Workflow />}
              title="1. Build Workflow"
              desc="Create your email flow using Lead Source, Wait and Email nodes."
            />
            <Step
              icon={<Mail />}
              title="2. Configure & Schedule"
              desc="Attach templates, delays and follow-ups in minutes."
            />
            <Step
              icon={<CheckCircle />}
              title="3. Track Execution"
              desc="Watch live status updates as emails are queued and sent."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }: any) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="rounded-xl border bg-background p-6 shadow-sm">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </motion.div>
  );
}

function Step({ icon, title, desc }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="text-center p-6 rounded-xl border bg-background shadow-sm">
      <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </motion.div>
  );
}
