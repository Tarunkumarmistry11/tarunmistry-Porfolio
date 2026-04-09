import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeaturedProjects } from "../features/projects/projectsSlice";
import { getAbout } from "../features/about/aboutSlice";
import ProjectCard from "../components/ProjectCard";
import MarqueeStrip from "../components/MarqueeStrip";

export default function Home() {
  const dispatch = useDispatch();

  const {
    featured = [],
    loading: projLoading,
    error: projError,
  } = useSelector((s) => s.projects);

  const {
    data: about,
    error: aboutError,
  } = useSelector((s) => s.about);

  const [reelVisible, setReelVisible] = useState(false);

  const REEL_URL =
    "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/63600c288b483e9c7398616b_reel-transcode.mp4";

  useEffect(() => {
    dispatch(getFeaturedProjects());
    dispatch(getAbout());
  }, [dispatch]);

  /**
   * ESC key + scroll lock
   */
  useEffect(() => {
    if (!reelVisible) return;

    const handleKey = (e) => {
      if (e.key === "Escape") setReelVisible(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKey);
    };
  }, [reelVisible]);

  const heroText = ["Giulia", "Gartner", "photographer", "&", "filmmaker"];

  return (
    <main className="bg-cream min-h-screen page-transition">
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-end px-6 md:px-10 pb-20 pt-32 overflow-hidden">
        <div className="absolute top-6 right-6 font-mono text-[10px] text-right leading-5 hidden md:block">
          <div>F/24</div>
          <div className="text-warm">F/1.4</div>
        </div>

        <div>
          {heroText.map((word, i) => (
            <div key={word} className="overflow-hidden">
              <h1
                className="font-serif text-[11vw] md:text-[8vw] leading-none tracking-tight animate-fadeUp"
                style={{ animationDelay: `${0.1 + i * 0.12}s` }}
              >
                {word}
              </h1>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-10 font-mono text-xs tracking-widest uppercase inline-flex items-center gap-3 group w-fit"
          onClick={() => setReelVisible(true)}
        >
          <span className="w-10 h-10 rounded-full border border-charcoal flex items-center justify-center group-hover:bg-charcoal group-hover:text-cream transition-all duration-300">
            ▶
          </span>
          play my reel
        </button>
      </section>

      {/* MODAL */}
      {reelVisible && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center"
          onClick={() => setReelVisible(false)}
        >
          <video
            src={REEL_URL}
            autoPlay
            controls
            className="max-w-5xl w-[90vw] max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            className="absolute top-8 right-8 text-cream font-mono text-xs tracking-widest uppercase"
            onClick={() => setReelVisible(false)}
          >
            Close
          </button>
        </div>
      )}

      {/* MARQUEE */}
      {about?.photos?.length > 0 && (
        <section className="py-6 overflow-hidden">
          <MarqueeStrip images={about.photos} />
        </section>
      )}

      {/* PROJECTS */}
      <section className="px-6 md:px-10 py-20 max-w-6xl mx-auto">
        {projLoading ? (
          <p className="font-mono text-xs tracking-widest text-charcoal/40 animate-pulse">
            Loading...
          </p>
        ) : projError ? (
          <p className="text-red-500 text-sm">Failed to load projects</p>
        ) : featured.length === 0 ? (
          <p className="text-charcoal/40 text-sm">No projects available</p>
        ) : (
          featured.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        )}
      </section>
    </main>
  );
}