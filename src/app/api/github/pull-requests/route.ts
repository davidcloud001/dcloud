import { NextRequest, NextResponse } from "next/server";
import { getPullRequests } from "@/lib/github";

export async function GET(request: NextRequest) {
  const repo = request.nextUrl.searchParams.get("repo")?.trim();

  if (!repo) {
    return NextResponse.json(
      { error: "Missing repo query parameter" },
      { status: 400 },
    );
  }

  try {
    const pullRequests = await getPullRequests(repo);

    return NextResponse.json(pullRequests);
  } catch (error) {
    console.error("GitHub pull requests API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch GitHub pull requests" },
      { status: 500 },
    );
  }
}