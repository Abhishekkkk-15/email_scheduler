import { NextResponse } from "next/server";
import { Flow } from "@/lib/models/Flow";
import { emailQueue } from "@/lib/queue/queue";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id)
    return NextResponse.json({ message: "Flow ID required" }, { status: 400 });

  await emailQueue.remove(id);
  await Flow.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
