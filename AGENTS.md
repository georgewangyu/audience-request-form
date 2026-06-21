# Audience Request Form Agent Notes

## Purpose

This repo is a small Vercel/Next.js app that lets audience members submit
requests that become GitHub issues.

## Core Boundary

- The public page must only show the form and a submit/success state.
- Do not show the private GitHub queue, issue preview, labels, or agent triage
  details to submitters.
- GitHub issue creation must happen server-side in `app/api/submit/route.ts`.
- Never expose `GITHUB_TOKEN` or any repo-write credential to client code.
- Do not prefix secret env vars with `NEXT_PUBLIC_`.

## Current Architecture

- `app/page.tsx`: public audience form.
- `app/api/submit/route.ts`: Vercel serverless route that validates input and
  creates a GitHub issue.
- `lib/request-schema.ts`: shared validation schema.
- `lib/github-issue.ts`: GitHub issue title/body/label generation and API call.

## Validation

Before handing off behavior changes, run:

```bash
npm run build
npm audit --audit-level=moderate
```

## Public Repo Caution

If `GITHUB_REPO` points at a public repo, submissions may become public issues.
Keep the form copy aligned with that reality and avoid collecting sensitive
personal details.
