import { useCopyToClipboard } from "../hooks/useCopyToClipboard";

export default function CopyEmail({ email = "photo@giuligartner.com" }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="flex flex-col items-start">
      <button
        onClick={() => copy(email)}
        className="font-mono text-xs tracking-wider text-charcoal/40 hover:text-charcoal transition-colors duration-300"
      >
        {copied ? "copied ✨" : "click to copy"}
      </button>
      <span
        className="font-serif text-xl cursor-pointer hover:italic transition-all duration-300"
        onClick={() => copy(email)}
      >
        {email}
      </span>
    </div>
  );
}