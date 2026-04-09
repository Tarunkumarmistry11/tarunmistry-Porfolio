import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjects } from "../features/projects/projectsSlice";
import ProjectCard from "../components/ProjectCard";

export default function Stills() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.projects);

  useEffect(() => {
    dispatch(getProjects("stills"));
  }, [dispatch]);

  return (
    <main className="bg-cream min-h-screen page-transition pt-28 px-6 md:px-10 max-w-6xl mx-auto">
      <h1 className="font-serif text-5xl md:text-7xl mb-16">Stills</h1>
      {loading && (
        <p className="font-mono text-xs tracking-widest text-charcoal/40 animate-pulse">
          Loading...
        </p>
      )}
      {error && (
        <p className="font-mono text-xs text-red-500">Error: {error}</p>
      )}
      {!loading &&
        list.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
    </main>
  );
}