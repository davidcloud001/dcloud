import { NextRequest, NextResponse } from "next/server";
import { getIssues } from "@/lib/github";

export async function GET(request: NextRequest) {
  const repo = request.nextUrl.searchParams.get("repo")?.trim();

  if (!repo) {
    return NextResponse.json(
      { error: "Missing repo query parameter" },
      { status: 400 },
    );
  }

  try {
    const issues = await getIssues(repo);

    return NextResponse.json(issues);
  } catch (error) {
    console.error("GitHub issues API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch GitHub issues" },
      { status: 500 },
    );
  }
}