import ProjectsExplorer from "@/components/ProjectsExplorer";

export default function ProjectsPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Projects</h1>
      <p className="mb-6 text-muted">
        Work across AI/ML, robotics, and software engineering. Filter by domain.
      </p>
      <ProjectsExplorer />
    </div>
  );
}
