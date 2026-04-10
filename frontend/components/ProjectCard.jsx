import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ColorPalette from "./ColorPalette";

const imgV = {
  hidden:   { opacity:0, scale:1.07, y:30 },
  visible: (i) => ({
    opacity:1, scale:1, y:0,
    transition:{ duration:1.4, ease:[0.16,1,0.3,1], delay: i * 0.13 },
  }),
};

const metaV = {
  hidden:  { opacity:0, y:22 },
  visible: { opacity:1, y:0,
    transition:{ duration:0.9, ease:[0.16,1,0.3,1], delay:0.25 } },
};

export default function ProjectCard({ project }) {
  const { title, slug, type, date, location,
          coverImageLeft, coverImageRight, colorPalette } = project;

  return (
    <motion.div
      initial="hidden" whileInView="visible"
      viewport={{ once:true, amount:0.1 }}
      style={{ marginBottom:"clamp(60px,10vw,120px)" }}
    >
      {/* Images */}
      <div style={{
        display:"grid",
        gridTemplateColumns: coverImageRight ? "1fr 1fr" : "1fr",
        gap:"10px", marginBottom:"20px",
      }}>
        <motion.div custom={0} variants={imgV}
          className="img-hover" style={{ aspectRatio:"4/5" }}>
          <img src={coverImageLeft} alt={title} />
        </motion.div>
        {coverImageRight && (
          <motion.div custom={1} variants={imgV}
            className="img-hover" style={{ aspectRatio:"4/5" }}>
            <img src={coverImageRight} alt={title} />
          </motion.div>
        )}
      </div>

      {/* Meta */}
      <motion.div variants={metaV} style={{
        display:"flex", alignItems:"flex-start",
        justifyContent:"space-between", flexWrap:"wrap", gap:"16px",
      }}>
        <div>
          <p style={{
            fontFamily:"'Space Mono', monospace",
            fontSize:"0.6rem", letterSpacing:"0.16em",
            textTransform:"uppercase", color:"var(--fg40)",
            marginBottom:"6px",
          }}>{date} — {location}</p>
          <h3 style={{
            fontFamily:"'Playfair Display', serif",
            fontSize:"clamp(1.6rem,3.5vw,2.6rem)",
            fontWeight:400, color:"var(--fg)", lineHeight:1.1,
          }}>{title}</h3>
          {colorPalette?.length > 0 && <ColorPalette colors={colorPalette} />}
        </div>

        <Link to={`/${type}/${slug}`}
          style={{
            fontFamily:"'Space Mono', monospace",
            fontSize:"0.6rem", letterSpacing:"0.12em",
            textTransform:"uppercase",
            border:"1px solid var(--fg)",
            padding:"10px 18px", color:"var(--fg)",
            alignSelf:"flex-start", marginTop:"6px",
            transition:"background 0.3s, color 0.3s",
            display:"inline-block",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background="var(--fg)"; e.currentTarget.style.color="var(--bg)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--fg)"; }}
        >See case study</Link>
      </motion.div>
    </motion.div>
  );
}