"use client";

import { FormEvent, useState } from "react";

const requestTypes = [
  ["video-request", "Video idea"],
  ["feature-request", "Feature request"],
  ["workflow-pain", "Workflow pain"],
  ["question", "Question"],
] as const;

const sources = [
  ["instagram", "Instagram"],
  ["tiktok", "TikTok"],
  ["youtube", "YouTube"],
  ["x", "X"],
  ["other", "Other"],
] as const;

const creatorLinks = [
  ["GitHub", "https://github.com/georgewangyu"],
  ["X", "https://x.com/georgewangyu"],
  ["Email", "mailto:hellogeorgehq@gmail.com"],
  ["Instagram", "https://www.instagram.com/snackoverflowgeorge/"],
  ["TikTok", "https://www.tiktok.com/@snackoverflowgeorge"],
  ["YouTube", "https://www.youtube.com/@snackoverflowgeorge"],
  ["LinkedIn", "https://www.linkedin.com/in/georgewangyu/"],
] as const;

type Status = "idle" | "submitting" | "success" | "error";

type ErrorResponse = {
  error?: string;
  issues?: Record<string, string[] | undefined>;
};

const issueLabels: Record<string, string> = {
  request: "Your request",
  why: "Why it matters",
  context: "Link or context",
  handle: "Handle",
};

async function errorMessageFor(response: Response) {
  if (response.status !== 400) {
    return "Something went wrong. Try again or DM George directly.";
  }

  const body = (await response.json().catch(() => null)) as ErrorResponse | null;
  const fieldMessages = Object.entries(body?.issues || {})
    .flatMap(([field, messages]) =>
      (messages || []).map((message) => `${issueLabels[field] || field}: ${message}`),
    );

  return fieldMessages.length > 0
    ? fieldMessages.join(" ")
    : body?.error || "Please check the form and try again.";
}

export default function Home() {
  const [requestType, setRequestType] = useState("video-request");
  const [source, setSource] = useState("instagram");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("submitting");
    setError("");

    const form = new FormData(formElement);
    const payload = {
      requestType,
      source,
      visibility: String(form.get("visibility") || "public"),
      request: String(form.get("request") || ""),
      why: String(form.get("why") || ""),
      context: String(form.get("context") || ""),
      handle: String(form.get("handle") || ""),
      website: String(form.get("website") || ""),
    };

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setStatus("error");
        setError(await errorMessageFor(response));
        return;
      }

      formElement.reset();
      setRequestType("video-request");
      setSource("instagram");
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Something went wrong. Try again or DM George directly.");
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <div className="brand">
          <div className="mark">G</div>
          <span>Audience Inbox</span>
        </div>
        <span className="nav-note">Send George a useful request.</span>
      </header>

      <section className="hero">
        <h1>What should George make next?</h1>
        <p>
          Send a video idea, feature request, workflow pain, or question. Good
          requests become work George can actually review instead of getting
          buried in comments.
        </p>
        <p className="public-note">
          Choose public if it can become a visible GitHub issue, or private if
          only George should see it.
        </p>
      </section>

      <form className="request-form" onSubmit={onSubmit}>
        <input className="trap" name="website" tabIndex={-1} autoComplete="off" />

        <section className="field">
          <span className="label">Request type</span>
          <div className="chips">
            {requestTypes.map(([value, label]) => (
              <button
                className={requestType === value ? "chip active" : "chip"}
                key={value}
                onClick={() => setRequestType(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="field">
          <span className="label">Where is this request coming from?</span>
          <div className="chips">
            {sources.map(([value, label]) => (
              <button
                className={source === value ? "chip active" : "chip"}
                key={value}
                onClick={() => setSource(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <label className="field">
          <span className="label">Visibility</span>
          <select name="visibility" defaultValue="public">
            <option value="public">Public GitHub issue</option>
            <option value="private">Private to George</option>
          </select>
        </label>

        <label className="field">
          <span className="label">Your request</span>
          <textarea
            name="request"
            placeholder="I want a video about how you..."
            minLength={10}
            maxLength={1500}
            required
          />
        </label>

        <label className="field">
          <span className="label">Why does this matter?</span>
          <textarea
            className="short"
            name="why"
            placeholder="What problem would this solve or what would it help you understand?"
            minLength={5}
            maxLength={1000}
            required
          />
        </label>

        <div className="two">
          <label className="field">
            <span className="label">Handle optional</span>
            <input name="handle" placeholder="Leave blank to stay anonymous" />
          </label>
          <label className="field">
            <span className="label">Link or context</span>
            <input name="context" placeholder="Optional post URL or note" />
          </label>
        </div>

        <div className="actions">
          <button disabled={status === "submitting"} type="submit">
            {status === "submitting" ? "Sending..." : "Send request"}
          </button>
        </div>

        {status === "success" ? (
          <div className="notice success">
            Request sent. If it has signal, it goes into George&apos;s triage queue.
          </div>
        ) : null}

        {status === "error" ? <div className="notice error">{error}</div> : null}
      </form>

      <div className="creator-links-block">
        <p className="creator-links-title">Created by George</p>
        <nav className="creator-links" aria-label="George links">
          {creatorLinks.map(([label, href]) => (
            <a href={href} key={label}>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </main>
  );
}
