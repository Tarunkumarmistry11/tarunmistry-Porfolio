export default function MarqueeStrip({ images = [], speed = "marquee" }) {
  const doubled = [...images, ...images];

  return (
    <div className="marquee-strip">
      <div className={`marquee-track ${speed === "marquee-slow" ? "speed-slow" : "speed-normal"}`}>
        {doubled.map((src, i) => (
          <div
            key={i}
            className="img-hover"
            style={{ width: "220px", height: "160px", flexShrink: 0 }}
          >
            <img
              src={src}
              alt=""
              style={{ filter: "grayscale(100%)" }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "grayscale(0%)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "grayscale(100%)")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}