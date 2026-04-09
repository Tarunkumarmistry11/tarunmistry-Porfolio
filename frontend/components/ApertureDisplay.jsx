export default function ApertureDisplay({ className = "" }) {
  return (
    <div className={`flex flex-col items-center font-mono text-[9px] leading-tight ${className}`}>
      <span>F/24</span>
      <span className="text-warm">F/1.4</span>
    </div>
  );
}