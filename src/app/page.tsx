import CreatePasteForm from '@/components/CreatePasteForm';

export default function HomePage() {
  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Pastebin Lite</p>
        <h1>Share snippets</h1>
      </header>
      <CreatePasteForm />
    </main>
  );
}
