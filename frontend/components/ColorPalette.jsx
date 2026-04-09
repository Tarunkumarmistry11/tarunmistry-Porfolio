export default function ColorPalette({ colors = [] }) {
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {colors.map((hex, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div
            className="w-8 h-8 rounded-full border border-black/10"
            style={{ backgroundColor: hex }}
          />
          <span className="font-mono text-[9px] text-charcoal/50">{hex}</span>
        </div>
      ))}
    </div>
  );
}