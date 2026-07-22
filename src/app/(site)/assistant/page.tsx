const starterPrompts = [
  "What's Yash's research about?",
  "What's his tech stack?",
  "What's he looking for?",
];

export default function AssistantPage() {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="mb-6 text-2xl font-semibold">Ask about Yash</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        {starterPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="rounded-full border border-border px-3 py-1 text-sm hover:border-accent hover:text-accent"
          >
            {prompt}
          </button>
        ))}
      </div>
      <div className="flex-1 rounded-lg border border-border p-4 text-muted">
        TODO: message list
      </div>
      <form className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Ask a question..."
          className="flex-1 rounded-full border border-border px-4 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          Send
        </button>
      </form>
    </div>
  );
}
