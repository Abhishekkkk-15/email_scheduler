import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Template } from "@/lib/models/Template";
import { dbConnect } from "@/lib/database/config";

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  console.log(session?.user);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { subject, body, title } = await req.json();
  if (!subject || !body || !title)
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  await Template.create({
    userId: session.user.id,
    subject,
    title,
    content: body,
    userEmail: session.user.email,
  });

  return NextResponse.json({ success: true });
}

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  console.log(session?.user);

  if (!session?.user?.email)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const templates = await Template.find({
    userId: session.user.id,
  });

  return NextResponse.json({ data: templates });
}
