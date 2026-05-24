import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { executeIntelligenceQuery } from "@/features/intelligence/services/execute-intelligence-query";
import { getCurrentWorkspace } from "@/features/workspace/queries/get-current-workspace";

type IntelligenceQueryRequest = {
  query?: string;
  sessionId?: string | null;
  turnId?: number;
};

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: IntelligenceQueryRequest;

  try {
    body = (await request.json()) as IntelligenceQueryRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const currentWorkspace = await getCurrentWorkspace();

  if (!currentWorkspace) {
    return NextResponse.json({ error: "Workspace not found." }, { status: 404 });
  }

  try {
    const response = await executeIntelligenceQuery({
      workspaceId: currentWorkspace.workspace.id,
      workspaceName: currentWorkspace.workspace.name,
      query: body.query ?? "",
      sessionId: body.sessionId,
    });

    return NextResponse.json({
      ...response,
      turnId: body.turnId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to process your operational query.",
      },
      { status: 400 },
    );
  }
}
