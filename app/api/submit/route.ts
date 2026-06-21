import { NextResponse } from "next/server";
import { createGitHubIssue } from "@/lib/github-issue";
import { audienceRequestSchema } from "@/lib/request-schema";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const allowedOrigin = process.env.REQUEST_FORM_ALLOWED_ORIGIN;

  if (allowedOrigin && origin && origin !== allowedOrigin) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = audienceRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid request.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  try {
    const issue = await createGitHubIssue(parsed.data);
    return NextResponse.json({
      ok: true,
      issueNumber: issue.number,
      issueUrl: issue.html_url,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not create request." },
      { status: 500 },
    );
  }
}
