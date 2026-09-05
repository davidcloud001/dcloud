import { NextRequest, NextResponse } from "next/server";
import { getBranches } from "@/lib/github";

export async function GET(request: NextRequest) {
  const repo = request.nextUrl.searchParams.get("repo")?.trim();

  if (!repo) {
    return NextResponse.json(
      { error: "Missing repo query parameter" },
      { status: 400 },
    );
  }

  try {
    const branches = await getBranches(repo);

    return NextResponse.json(branches);
  } catch (error) {
    console.error("GitHub branches API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch GitHub branches" },
      { status: 500 },
    );
  }
}