import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/database/config";
import { Flow } from "@/lib/models/Flow";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const { nodes, edges, flowId } = await req.json();
  const name = nodes.find((n: any) => n.type == "leadSource");
  let flow;
  if (flowId) {
    flow = await Flow.findByIdAndUpdate(
      flowId,
      {
        $set: {
          nodes,
          edges,
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );
  } else {
    flow = await Flow.create({
      name: name.data.config.source,
      userId: session.user.id,
      userEmail: session.user.email,
      nodes,
      edges,
    });
  }
  return NextResponse.json(
    {
      success: true,
      message: "Workflow saved successfully",
      flowId: flow.id,
    },
    { status: 200 }
  );
}
