# Audience Request Form Vision

Audience Request Form should be a tiny public intake surface that turns social
audience requests into GitHub issues without exposing the private triage queue.

## Product Thesis

The product is useful when followers can submit video ideas, feature requests,
workflow pain, and questions through one clean form, while the operator keeps
normal GitHub and agent workflows as the backend of record. The app should feel
simple to the submitter and boringly secure to maintain.

## Goals

- Keep the public page limited to the request form and submit/success states.
- Create GitHub issues only through the server-side API route.
- Keep repo-write tokens and triage details out of browser code.
- Make public-vs-private issue routing explicit in docs and form copy.

## Non-Goals

- Do not show submitters the GitHub issue preview, labels, or internal queue.
- Do not collect sensitive personal details by default.
- Do not add a database or scheduler before the issue-intake loop needs one.
