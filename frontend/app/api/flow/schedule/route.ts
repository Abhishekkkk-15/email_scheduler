import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Flow } from "@/lib/models/Flow";
import { csvQueue, emailQueue } from "@/lib/queue/queue";
import { dbConnect } from "@/lib/database/config";

function getNextNode(nodeId: string, edges: any[]) {
  const outgoing = edges.filter((e) => e.source === nodeId);

  if (outgoing.length === 0) return null;
  if (outgoing.length > 1) {
    throw new Error(`Multiple outgoing edges from node ${nodeId}`);
  }

  return outgoing[0].target;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const { nodes, edges } = await req.json();
  const name = nodes.find((n: any) => n.type == "leadSource");
  console.log(name.data.config.source, name);
  const flow = await Flow.create({
    name: name.data.config.source,
    userId: session.user.id,
    userEmail: session.user.email,
    nodes,
    edges,
  });

  const leadSource = nodes.find((n: any) => n.type === "leadSource");
  if (!leadSource)
    return NextResponse.json(
      { message: "Lead source missing" },
      { status: 400 }
    );

  let currentNodeId = getNextNode(leadSource.id, edges);
  // delay = accumulated wait time in milliseconds from flow start
  let delay = 0;

  while (currentNodeId) {
    const node = nodes.find((n: any) => n.id === currentNodeId);

    if (!node) {
      throw new Error(`Node not found: ${currentNodeId}`);
    }
    console.log("mode", node.data.config.senderName);
    if (
      (node.type === "coldEmail" || node.type === "followupEmail") &&
      node.data.config.mode == "single"
    ) {
      await emailQueue.add(
        "send-email",
        {
          userId: user.id,
          to: node.data.config.singleEmail,
          subject: node.data.config.subject,
          body: node.data.config.body,
          sender: node.data.config.senderEmail,
          senderName: node.data.config.senderName,
          emailId: flow._id,
        },
        { delay: delay }
      );
      console.log("single delay", delay);
    } else {
      if (
        (node.type === "coldEmail" || node.type === "followupEmail") &&
        node.data.config.mode == "csv"
      ) {
        await csvQueue.add("process-csv", {
          userId: user.id,
          sender: node.data.config.senderEmail,
          emails: node.data.config.csvEmails,
          subject: node.data.config.subject,
          body: node.data.config.body,
          senderName: node.data.config.senderName,
          delay,
          emailId: flow._id,
        });
        console.log("csv delay", delay);
      }
    }

    if (node.type === "wait") {
      const value = Number(node.data?.config?.delay);
      const unit = node.data?.config?.unit;
      console.log("type", unit);
      delay = 0;
      if (!Number.isFinite(value) || value < 0) {
        throw new Error("Invalid delay value");
      }

      const unitMap: Record<string, number> = {
        seconds: 1000,
        minutes: 60_000,
        hours: 3_600_000,
      };

      const multiplier = unitMap[unit];
      if (!multiplier) {
        throw new Error("Invalid delay unit");
      }

      delay += value * multiplier;
    }

    currentNodeId = getNextNode(currentNodeId, edges);
  }

  return NextResponse.json({ success: true });
}
