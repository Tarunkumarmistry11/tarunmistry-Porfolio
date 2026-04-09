export default function MarqueeStrip({ images = [], speed = "marquee" }) {
  const doubled = [...images, ...images];

  const animationClass =
  speed === "marquee-slow" ? "animate-marquee-slow" : "animate-marquee";
  
  return (
    <div className="overflow-hidden w-full">
      <div className={`flex gap-3 ${animationClass}`}>
        {doubled.map((src, i) => (
          <div key={`${src}-${i}`} className="w-48 h-36 md:w-64 md:h-48">
            <img
              src={src}
              alt="gallery"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition"
            />
          </div>
        ))}
      </div>
    </div>
  );
}