import { NextResponse } from "next/server";
import { getRepositories } from "@/lib/github";

export async function GET() {
  try {
    const repositories = await getRepositories();

    return NextResponse.json(repositories);
  } catch (error) {
    console.error("GitHub repositories API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch GitHub repositories" },
      { status: 500 },
    );
  }
}