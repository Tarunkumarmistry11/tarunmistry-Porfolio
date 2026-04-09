import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getProjects } from "../features/projects/projectsSlice";

export default function Motion() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.projects);

  useEffect(() => {
    dispatch(getProjects("motion"));
  }, [dispatch]);

  return (
    <main className="bg-cream min-h-screen page-transition pt-28 px-6 md:px-10 max-w-6xl mx-auto">
      <h1 className="font-serif text-5xl md:text-7xl mb-16">Motion</h1>
      {loading && (
        <p className="font-mono text-xs tracking-widest text-charcoal/40 animate-pulse">
          Loading...
        </p>
      )}
      {error && (
        <p className="font-mono text-xs text-red-500">Error: {error}</p>
      )}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {list.map((project) => (
            <div key={project._id} className="group">
              <div className="relative overflow-hidden aspect-video mb-4">
                <img
                  src={project.coverImageLeft}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="w-14 h-14 rounded-full border-2 border-cream flex items-center justify-center text-cream text-lg">
                    ▶
                  </span>
                </div>
              </div>
              <p className="font-mono text-xs text-charcoal/40 uppercase tracking-widest">
                {project.date} — {project.location}
              </p>
              <div className="flex items-center justify-between mt-1">
                <h3 className="font-serif text-2xl">{project.title}</h3>
                <Link
                  to={`/motion/${project.slug}`}
                  className="font-mono text-xs uppercase tracking-widest border border-charcoal px-3 py-1 hover:bg-charcoal hover:text-cream transition-all duration-300"
                >
                  See case study
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}