import type { AudienceRequest } from "./request-schema";

const requestTypeLabels: Record<AudienceRequest["requestType"], string> = {
  "video-request": "type:video-request",
  "feature-request": "type:feature-request",
  "workflow-pain": "type:workflow-pain",
  question: "type:question",
};

const requestTypeTitles: Record<AudienceRequest["requestType"], string> = {
  "video-request": "Video request",
  "feature-request": "Feature request",
  "workflow-pain": "Workflow pain",
  question: "Question",
};

const desiredOutcomeTitles: Record<AudienceRequest["desiredOutcome"], string> = {
  "make-video": "Make a video",
  "build-or-change": "Build or change something",
  "answer-question": "Answer the question",
  "not-sure": "Not sure",
};

const routeLabels: Record<AudienceRequest["desiredOutcome"], string> = {
  "make-video": "route:content-candidate",
  "build-or-change": "route:build-candidate",
  "answer-question": "route:answer-candidate",
  "not-sure": "route:needs-human-review",
};

const specificityTitles: Record<AudienceRequest["specificity"], string> = {
  "rough-idea": "Rough idea",
  "clear-request": "Clear request",
  "exact-change": "Exact change or bug",
};

function compactTitle(input: string) {
  const singleLine = input.replace(/\s+/g, " ").trim();
  return singleLine.length > 78 ? `${singleLine.slice(0, 75)}...` : singleLine;
}

export function issueTitle(request: AudienceRequest) {
  return `[${request.requestType}] ${compactTitle(request.request)}`;
}

export function issueLabels(request: AudienceRequest) {
  return [
    "audience-request",
    "status:needs-triage",
    requestTypeLabels[request.requestType],
    routeLabels[request.desiredOutcome],
    `specificity:${request.specificity}`,
    `source:${request.source}`,
  ];
}

export function issueBody(request: AudienceRequest) {
  const handle = request.handle || "_Anonymous / not provided_";
  const context = request.context || "_Not provided_";

  return [
    "## Audience request",
    "",
    `**Type:** ${requestTypeTitles[request.requestType]}`,
    `**Source:** ${request.source}`,
    `**Handle:** ${handle}`,
    "",
    "## Orchestrator signals",
    "",
    `**Desired outcome:** ${desiredOutcomeTitles[request.desiredOutcome]}`,
    `**Suggested route:** ${routeLabels[request.desiredOutcome]}`,
    `**Specificity:** ${specificityTitles[request.specificity]}`,
    "",
    "## Request",
    "",
    request.request,
    "",
    "## Why it matters",
    "",
    request.why,
    "",
    "## Link or context",
    "",
    context,
    "",
    "## Triage checklist",
    "",
    "- [ ] Deduplicate against similar requests",
    "- [ ] Classify as can-start-now, needs-human-review, content-candidate, build-candidate, answer-candidate, or ignore",
    "- [ ] Add evidence or source links if useful",
    "- [ ] Create a linked implementation issue or content brief if accepted",
  ].join("\n");
}

export async function createGitHubIssue(request: AudienceRequest) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    throw new Error("Missing GitHub issue environment configuration.");
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version":
          process.env.GITHUB_API_VERSION || "2022-11-28",
      },
      body: JSON.stringify({
        title: issueTitle(request),
        body: issueBody(request),
        labels: issueLabels(request),
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub issue creation failed: ${response.status} ${body}`);
  }

  return (await response.json()) as { html_url: string; number: number };
}
