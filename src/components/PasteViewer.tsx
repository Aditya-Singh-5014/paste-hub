'use client';

import { useState } from 'react';
import type { FetchPasteResponse } from '@/lib/types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PasteViewerProps {
  paste: FetchPasteResponse;
}

export default function PasteViewer({ paste }: PasteViewerProps) {
  const [copied, setCopied] = useState(false);

  const remainingViews = paste.remaining_views === null
    ? 'Unlimited'
    : String(paste.remaining_views);
  const expiresAt = paste.expires_at
    ? new Date(paste.expires_at).toLocaleString()
    : 'No expiry';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(paste.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const languageMap: Record<string, string> = {
    text: 'text',
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
    java: 'java',
    cpp: 'cpp',
    csharp: 'csharp',
    go: 'go',
    rust: 'rust',
    html: 'markup',
    css: 'css',
    json: 'json',
    markdown: 'markdown',
    sql: 'sql',
    bash: 'bash'
  };

  const highlightLanguage = languageMap[paste.language] || 'text';
  const isPlainText = paste.language === 'text';

  return (
    <div className="card">
      <div className="paste-header">
        <div className="meta">
          <span>📝 Language: {paste.language}</span>
          <span>👁 Remaining views: {remainingViews}</span>
          <span>⏱ Expires: {expiresAt}</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="copy-button-secondary"
          aria-label="Copy paste content"
        >
          {copied ? (
            <span className="copied-text">✓ Copied!</span>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {isPlainText ? (
        <pre className="paste">{paste.content}</pre>
      ) : (
        <div className="paste syntax-highlight">
          <SyntaxHighlighter
            language={highlightLanguage}
            style={oneDark}
            customStyle={{
              margin: 0,
              padding: 0,
              background: 'transparent',
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}
            wrapLongLines={true}
          >
            {paste.content}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}
