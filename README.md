# Audience Request Form

## One-Pager

Audience Request Form is a tiny Vercel site that lets Instagram, TikTok, or
other social followers submit video ideas, feature requests, workflow pain, and
questions. Each valid submission becomes a GitHub issue so the request can be
triaged by normal GitHub/agent workflows.

## What The Viewer Sees

The public site is only a form:

- request type
- source platform
- request text
- why it matters
- optional source link/context
- optional handle; blank means anonymous

The viewer should not see the private GitHub queue, issue preview, triage
labels, or agent workflow. After submit, they only see a success state.

## Smallest Real Architecture

```text
Public form
  -> POST /api/submit
  -> Vercel serverless function
  -> GitHub REST API
  -> issue in GITHUB_OWNER/GITHUB_REPO
```

There is no database and no long-running backend. There is still a server-side
function because the GitHub token must not be exposed in browser JavaScript.
Vercel deploys Next.js `app/api/*/route.ts` files as functions.

## Orchestrator Shape

Submissions are structured so a future orchestrator can judge what happens
next:

- `requestType`: viewer-facing classification
- `source`: where the request came from
- `request`: the user's actual ask
- `why`: preserves user pain/context for ranking and dedupe
- `context`: optional source link, comment reference, or extra detail

The form intentionally does not ask the submitter to classify route,
specificity, or actionability. The initial issue gets `status:needs-triage`,
and the orchestrator infers whether it is can-start-now, needs-human-review,
content-candidate, build-candidate, answer-candidate, ignore, or a future
category.

## Public Repo vs Private Repo

The app can create issues in the same public repo if the goal is transparent
public requests. That means submissions may become public GitHub issues, so the
form copy should avoid collecting sensitive personal details.

For private audience intake, set `GITHUB_REPO` to a private repository such as
`audience-inbox`. The app itself can still be public.

## Environment

Copy `.env.example` to `.env.local` and set:

- `GITHUB_TOKEN`: fine-grained token with Issues read/write on the target repo
- `GITHUB_OWNER`: repository owner
- `GITHUB_REPO`: repository where issues should be created

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment

Deploy to Vercel and set the same environment variables in the Vercel project
settings. The token remains server-side as long as it is not prefixed with
`NEXT_PUBLIC_`.

References:

- GitHub issue creation API:
  `POST /repos/{owner}/{repo}/issues`
- Vercel functions: Next.js `app/api/my-route/route.ts`
- Next.js env rule: non-`NEXT_PUBLIC_` env vars are server-only by default
