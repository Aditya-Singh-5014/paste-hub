'use client';

import { useState, useRef, useEffect } from 'react';
import type { CreatePasteRequest, PasteLanguage } from '@/lib/types';
import { createPaste } from '@/lib/api';

const LANGUAGES: { value: PasteLanguage; label: string }[] = [
  { value: 'text', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' }
];

export default function CreatePasteForm() {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [language, setLanguage] = useState<PasteLanguage>('text');
  const [result, setResult] = useState<{ id: string; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && successRef.current) {
      successRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [result]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError('Content is required.');
      return;
    }

    const ttlValue = ttlSeconds.trim() ? Number(ttlSeconds) : undefined;
    if (ttlValue !== undefined && (!Number.isInteger(ttlValue) || ttlValue < 1)) {
      setError('TTL must be a whole number greater than or equal to 1.');
      return;
    }

    const maxViewsValue = maxViews.trim() ? Number(maxViews) : undefined;
    if (maxViewsValue !== undefined && (!Number.isInteger(maxViewsValue) || maxViewsValue < 1)) {
      setError('Max views must be a whole number greater than or equal to 1.');
      return;
    }

    const payload: CreatePasteRequest = {
      content: trimmedContent,
      language
    };

    if (ttlValue !== undefined) {
      payload.ttl_seconds = ttlValue;
    }

    if (maxViewsValue !== undefined) {
      payload.max_views = maxViewsValue;
    }

    try {
      setLoading(true);
      const response = await createPaste(payload);
      setResult(response);
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
      setCopied(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create paste.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result?.url) return;

    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section className="card">
      <form onSubmit={onSubmit} className="form">
        <div className="field">
          <label htmlFor="content">Paste content</label>
          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write your paste here"
          />
        </div>

        <div className="field">
          <label htmlFor="language">Language / Syntax</label>
          <select
            id="language"
            value={language}
            onChange={(event) => setLanguage(event.target.value as PasteLanguage)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="inline-grid">
          <div className="field">
            <label htmlFor="ttl">TTL (seconds)</label>
            <input
              id="ttl"
              inputMode="numeric"
              value={ttlSeconds}
              onChange={(event) => setTtlSeconds(event.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="field">
            <label htmlFor="maxViews">Max views</label>
            <input
              id="maxViews"
              inputMode="numeric"
              value={maxViews}
              onChange={(event) => setMaxViews(event.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create paste'}
        </button>

        {result && (
          <div ref={successRef} className="feedback success">
            <div className="feedback-header">
              <span>✓ Paste created successfully!</span>
            </div>
            <div className="url-container">
              <a href={result.url} target="_blank" rel="noreferrer" className="paste-url">
                {result.url}
              </a>
              <button
                type="button"
                onClick={copyToClipboard}
                className="copy-button"
                aria-label="Copy URL"
              >
                {copied ? (
                  <span className="copied-text">✓ Copied!</span>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="feedback error">
            <div>{error}</div>
          </div>
        )}
      </form>
    </section>
  );
}
