import { NextRequest, NextResponse } from "next/server";
import { getWorkflowRuns } from "@/lib/github";

export async function GET(request: NextRequest) {
  const repo = request.nextUrl.searchParams.get("repo")?.trim();

  if (!repo) {
    return NextResponse.json(
      { error: "Missing repo query parameter" },
      { status: 400 },
    );
  }

  try {
    const workflowRuns = await getWorkflowRuns(repo);

    return NextResponse.json(workflowRuns);
  } catch (error) {
    console.error("GitHub workflow runs API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch GitHub workflow runs" },
      { status: 500 },
    );
  }
}