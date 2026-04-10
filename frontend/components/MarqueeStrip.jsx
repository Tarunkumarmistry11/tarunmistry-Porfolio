export default function MarqueeStrip({ images = [], slow = false }) {
  const doubled = [...images, ...images];

  return (
    <div className="marquee-root">
      <div className={`marquee-track ${slow ? "marquee-track--slow" : "marquee-track--normal"}`}>
        {doubled.map((src, i) => (
          <div
            key={i}
            className="img-hover"
            style={{ width: "220px", height: "160px", flexShrink: 0 }}
          >
            <img
              src={src} alt=""
              style={{ filter: "grayscale(1)" }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "grayscale(0)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "grayscale(1)")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}