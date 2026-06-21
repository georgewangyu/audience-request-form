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

type Status = "idle" | "submitting" | "success" | "error";

export default function Home() {
  const [requestType, setRequestType] = useState("video-request");
  const [source, setSource] = useState("instagram");
  const [quoteConsent, setQuoteConsent] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const form = new FormData(event.currentTarget);
    const payload = {
      requestType,
      source,
      quoteConsent,
      request: String(form.get("request") || ""),
      why: String(form.get("why") || ""),
      context: String(form.get("context") || ""),
      handle: String(form.get("handle") || ""),
      website: String(form.get("website") || ""),
    };

    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatus("error");
      setError("Something went wrong. Try again or DM George directly.");
      return;
    }

    event.currentTarget.reset();
    setRequestType("video-request");
    setSource("instagram");
    setQuoteConsent(true);
    setStatus("success");
  }

  return (
    <main className="page">
      <header className="topbar">
        <div className="brand">
          <div className="mark">G</div>
          <span>Audience Inbox</span>
        </div>
        <span className="nav-note">Requests become GitHub issues for triage.</span>
      </header>

      <section className="hero">
        <h1>What should George make next?</h1>
        <p>
          Send a video idea, feature request, workflow pain, or question. Good
          requests become work George can actually review instead of getting
          buried in comments.
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
          <span className="label">Where did this come from?</span>
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
          <span className="label">Your request</span>
          <textarea
            name="request"
            placeholder="I want a video about how you..."
            required
          />
        </label>

        <label className="field">
          <span className="label">Why does this matter?</span>
          <textarea
            className="short"
            name="why"
            placeholder="What problem would this solve or what would it help you understand?"
            required
          />
        </label>

        <div className="two">
          <label className="field">
            <span className="label">Handle</span>
            <input name="handle" placeholder="@optional" />
          </label>
          <label className="field">
            <span className="label">Link or context</span>
            <input name="context" placeholder="Optional post URL or note" />
          </label>
        </div>

        <label className="consent">
          <span>
            <strong>Anonymous quote allowed</strong>
            <small>
              If this becomes content, George can quote the request without
              naming you.
            </small>
          </span>
          <input
            checked={quoteConsent}
            onChange={(event) => setQuoteConsent(event.target.checked)}
            type="checkbox"
          />
        </label>

        <div className="actions">
          <p>
            Do not include private details. Requests may become GitHub issues.
          </p>
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
    </main>
  );
}
