import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

const fieldShell =
  "w-full rounded-[9px] border border-zinc-700 bg-zinc-900/60 px-3.5 py-3 text-[15px] text-zinc-100 outline-none placeholder:text-zinc-500 transition-colors focus:border-wp-teal focus:bg-zinc-900";

interface FieldWrapperProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}

export function FieldWrapper({ label, htmlFor, hint, children }: FieldWrapperProps) {
  return (
    <div className="mb-5">
      <label htmlFor={htmlFor} className="mb-2 block text-[13.5px] font-semibold text-zinc-100">
        {label}
        {hint && <span className="mt-0.5 block text-xs font-normal text-zinc-400">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

export function TextField({
  id,
  placeholder,
  type = "text",
  required,
  value,
  onChange,
}: {
  id: string;
  placeholder: string;
  type?: "text" | "email" | "tel";
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={fieldShell}
    />
  );
}

export function SelectField({
  id,
  required,
  value,
  onChange,
  options,
  placeholder = "Select one option",
}: {
  id: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setOpen((o) => !o)}
        aria-required={required}
        className={`${fieldShell} flex items-center justify-between text-left ${
          !selected ? "text-zinc-500" : ""
        }`}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-wp-mint"
        >
          <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
            <path d="M1 1l6 6 6-6" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-20 mt-2 w-full origin-top overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 py-1.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]"
          >
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-[14.5px] transition-colors hover:bg-zinc-800 ${
                    opt.value === value ? "text-wp-mint" : "text-zinc-100"
                  }`}
                >
                  {opt.label}
                  {opt.value === value && (
                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                      <path d="M1 5.5 5 9.5 13 1" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TextAreaField({
  id,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <textarea
      id={id}
      name={id}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className={`${fieldShell} resize-y`}
    />
  );
}

export function ChoiceRow({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex gap-3">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`flex flex-1 cursor-pointer items-center gap-2.5 rounded-[9px] border px-3.5 py-3 transition-colors ${
            value === opt.value
              ? "border-wp-teal bg-wp-teal/10"
              : "border-zinc-700 bg-zinc-900/60"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={(e) => onChange(e.target.value)}
            required
            className="accent-wp-teal"
          />
          <span className="text-[14.5px]">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}