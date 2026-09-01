type PromptCardProps = {
  tag: string;
  title: string;
  copy: string;
  buttonLabel: string;
  prompt: string;
  onCopy: (text: string) => void;
};

export function PromptCard({ tag, title, copy, buttonLabel, prompt, onCopy }: PromptCardProps) {
  return (
    <div className="mt-8 rounded-3xl border border-lead/25 bg-lead/[0.07] p-5 sm:p-6">
      <span className="inline-flex items-center rounded-full bg-lead px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-pure-white">
        {tag}
      </span>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-midnight">{title}</h3>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-midnight/70">{copy}</p>
        </div>
        <button
          type="button"
          onClick={() => onCopy(prompt)}
          className="shrink-0 rounded-full bg-lead px-6 py-3 text-sm font-bold text-pure-white transition-transform hover:scale-[1.03]"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
