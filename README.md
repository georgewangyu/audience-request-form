# Audience Request Form

[Live form](https://requests.snackoverflowgeorge.com) ·
[Public request issues](https://github.com/georgewangyu/audience-request-form/issues)

## One-Pager

Audience Request Form is a tiny Vercel site that lets Instagram, TikTok, or
other social followers submit video ideas, feature requests, workflow pain, and
questions. Each valid submission becomes a GitHub issue so the request can be
triaged by normal GitHub/agent workflows.

## What The Viewer Sees

The public site is only a form:

- request type
- source platform
- visibility: public GitHub issue or private to George
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
  -> issue in GITHUB_OWNER/GITHUB_REPO or GITHUB_PRIVATE_REPO
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

The app supports two issue destinations:

- public submissions go to `GITHUB_REPO`, currently the public
  `audience-request-form` repo
- private submissions go to `GITHUB_PRIVATE_REPO`, currently the private
  `audience-private-intake` repo

This is the reusable pattern for future public GitHub README projects: expose
the public queue when transparency helps, but include a private route for
requests that should not become visible GitHub issues. The public form should
always explain the choice before submit.

## Environment

Copy `.env.example` to `.env.local` and set:

- `GITHUB_TOKEN`: fine-grained token with Issues read/write on the target repo
- `GITHUB_OWNER`: repository owner
- `GITHUB_REPO`: public issue destination
- `GITHUB_PRIVATE_REPO`: private issue destination

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
