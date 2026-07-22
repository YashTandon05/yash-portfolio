export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold">Contact</h1>
      <a href="mailto:TODO@example.com" className="underline">
        TODO@example.com
      </a>
      <div className="flex gap-4 text-sm underline">
        <a href="#">LinkedIn</a>
        <a href="#">GitHub</a>
      </div>
      <a
        href="/resume.pdf"
        className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
      >
        Download Resume
      </a>
      <p className="text-sm text-muted">
        Or ask my <a href="/assistant" className="underline">AI assistant</a> first.
      </p>
    </div>
  );
}
