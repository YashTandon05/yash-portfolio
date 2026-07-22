export default function ResumePage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Resume</h1>
        <a
          href="/resume.pdf"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          Download PDF
        </a>
      </div>
      <p className="text-muted">
        TODO: Education, Experience, Projects, Skills sections go here.
      </p>
    </div>
  );
}
