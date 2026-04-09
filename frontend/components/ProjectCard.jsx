import { Link } from "react-router-dom";
import ColorPalette from "../components/ColorPalette";

export default function ProjectCard({ project }) {
  const {
    title,
    slug,
    type,
    date,
    location,
    coverImageLeft,
    coverImageRight,
    colorPalette,
  } = project;

  return (
    <div className="group mb-20">
      <div className="grid grid-cols-2 gap-2 mb-5 overflow-hidden">
        <div className="overflow-hidden aspect-[4/5]">
          <img
            src={coverImageLeft}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        {coverImageRight && (
          <div className="overflow-hidden aspect-[4/5]">
            <img
              src={coverImageRight}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}
      </div>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-mono text-xs text-charcoal/40 uppercase tracking-widest">
            {date} — {location}
          </p>
          <h3 className="font-serif text-2xl md:text-3xl mt-1">{title}</h3>
          {colorPalette && colorPalette.length > 0 && (
            <ColorPalette colors={colorPalette} />
          )}
        </div>
        <Link
          to={`/${type}/${slug}`}
          className="font-mono text-xs uppercase tracking-widest border border-charcoal px-4 py-2 hover:bg-charcoal hover:text-cream transition-all duration-300 self-start mt-1"
        >
          See case study
        </Link>
      </div>
    </div>
  );
}