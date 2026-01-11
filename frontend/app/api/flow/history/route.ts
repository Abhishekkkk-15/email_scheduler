import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Flow } from "@/lib/models/Flow";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const history = await Flow.find({
    userId: session.user.id,
  });

  return NextResponse.json({ data: history });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // Alternative method specifically for Next.js environments
  // const searchParams = request.nextUrl.searchParams;

  const id = searchParams.get("id") as string;
  if (!id) NextResponse.json({ message: "Id not provided" }, { status: 404 });
  console.log(id);
  return await Flow.deleteOne(id as string);
}
