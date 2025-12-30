import { notFound } from 'next/navigation';
import { ApiError, fetchPaste } from '@/lib/api';
import PasteViewer from '@/components/PasteViewer';

export default async function PastePage({ params }: { params: { id: string } }) {
  try {
    const paste = await fetchPaste(params.id);

    return (
      <main className="page">
        <header className="hero hero-small">
          <p className="eyebrow">Pastebin Lite</p>
          <h1>Your Paste</h1>
        </header>
        <PasteViewer paste={paste} />
      </main>
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
