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
    `source:${request.source}`,
    request.quoteConsent ? "privacy:anonymous-quote-ok" : "privacy:no-quote",
  ];
}

export function issueBody(request: AudienceRequest) {
  const handle = request.handle || "_Not provided_";
  const context = request.context || "_Not provided_";
  const quoteConsent = request.quoteConsent
    ? "Anonymous quote allowed"
    : "Do not quote";

  return [
    "## Audience request",
    "",
    `**Type:** ${requestTypeTitles[request.requestType]}`,
    `**Source:** ${request.source}`,
    `**Handle:** ${handle}`,
    `**Quote consent:** ${quoteConsent}`,
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
    "- [ ] Decide content vs product vs ignore",
    "- [ ] Add evidence or source links if useful",
    "- [ ] Create a linked implementation/content brief if accepted",
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
