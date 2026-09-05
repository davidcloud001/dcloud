import { NextRequest, NextResponse } from "next/server";
import { getRepository } from "@/lib/github";

export async function GET(
request: NextRequest,
{ params }: { params: Promise<{ repo: string }> },
) {
try {
const { repo } = await params;

if (!repo) {
  return NextResponse.json(
    { error: "Missing repository name" },
    { status: 400 },
  );
}

const repository = await getRepository(repo);

return NextResponse.json(repository.data);

} catch (error) {
console.error("GitHub repository API error:", error);

return NextResponse.json(
  { error: "Failed to fetch GitHub repository" },
  { status: 500 },
);

}
}