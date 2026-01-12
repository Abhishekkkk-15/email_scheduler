import DashboardPage from "@/components/dashboard/DashboardPage";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/database/config";
import { Flow } from "@/lib/models/Flow";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  await dbConnect();
  if (!user) redirect("/login");
  const workflows = await Flow.find({
    userId: user?.id,
  }).lean();
  console.log("workflows", workflows);
  const safeWorkflows = workflows.map((flow: any) => ({
    ...flow,
    _id: flow._id.toString(),
    userId: flow.userId?.toString?.() ?? flow.userId,
    createdAt: flow.createdAt?.toISOString?.() ?? null,
    updatedAt: flow.updatedAt?.toISOString?.() ?? null,
    nodes: flow.nodes?.map((n: any) => ({
      ...n,
      id: n.id?.toString?.() ?? n.id,
      position: { x: n?.position?.x, y: n?.position?.y },
    })),
  }));
  return (
    <div>
      <DashboardPage workflows={safeWorkflows} />
    </div>
  );
}
