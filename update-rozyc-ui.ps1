# Run this from the root of your project: C:\Dev\word-power-registration
# It writes the updated Hero + Modal split, and installs framer-motion if missing.

Write-Host "Installing framer-motion (safe to re-run)..." -ForegroundColor Cyan
npm install framer-motion

function Write-Utf8NoBom($Path, $Content) {
  $full = Join-Path (Get-Location) $Path
  $dir = Split-Path $full -Parent
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  [System.IO.File]::WriteAllText($full, $Content, (New-Object System.Text.UTF8Encoding($false)))
  Write-Host "Wrote $Path" -ForegroundColor Green
}

if (Test-Path "src\components\RegistrationForm.tsx") {
  Remove-Item "src\components\RegistrationForm.tsx"
  Write-Host "Removed old RegistrationForm.tsx" -ForegroundColor Yellow
}

$FormFieldContent = @'
import type { ReactNode } from "react";

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
}: {
  id: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
}) {
  return (
    <select
      id={id}
      name={id}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${fieldShell} appearance-none bg-[url('data:image/svg+xml;utf8,<svg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2214%22_height=%229%22><path_d=%22M1_1l6_6_6-6%22_stroke=%22%238fe3d3%22_stroke-width=%221.6%22_fill=%22none%22/></svg>')] bg-[right_14px_center] bg-no-repeat pr-10`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
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
'@

$HeroContent = @'
import { motion } from "framer-motion";
import flyer from "../assets/rozyc-flyer.jpeg";

export default function Hero({ onRegister }: { onRegister: () => void }) {
  return (
    <div className="mx-auto w-full max-w-[640px]">
      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <img
          src={flyer}
          alt="Word & Power Conference — Anticipate! The teaser campaign for ROZYC 2026."
          className="block w-full"
        />

        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
          onClick={onRegister}
          className="absolute inset-x-6 bottom-6 rounded-xl bg-white py-3.5 text-[15px] font-bold text-wp-deep shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform hover:scale-[1.015] active:scale-[0.99]"
        >
          Register for ROZYC 2026
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className="px-5 pb-16 pt-6 text-center"
      >
        <div className="text-xs font-semibold tracking-[0.22em] text-wp-mint">
          ROSE OF SHARON ZONAL YOUTHS CONFERENCE
        </div>
        <p className="mt-2 text-[15px] italic text-wp-mint">Theme: Beholding</p>
        <p className="mx-auto mt-1 max-w-[380px] text-[13px] text-wp-ink-dim">
          "But we all, with open face beholding as in a glass the glory of the Lord, are changed into the same image."
          <br />— 2 Corinthians 3:18
        </p>
        <p className="mt-1.5 text-[13px] font-semibold text-wp-gold">Date to be confirmed</p>
      </motion.div>
    </div>
  );
}
'@

$ModalContent = @'
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChoiceRow,
  FieldWrapper,
  SelectField,
  TextAreaField,
  TextField,
} from "./FormField";

// Replace with the real n8n production webhook URL once Phase 4 is live.
const WEBHOOK_URL = "https://YOUR-N8N-INSTANCE/webhook/rozyc-registration";

const DESCRIBES_OPTIONS = [
  { value: "", label: "Select one option", disabled: true },
  { value: "pastor_minister", label: "Pastor / Minister" },
  { value: "church_worker", label: "Church Worker" },
  { value: "member", label: "Church Member" },
  { value: "first_time_guest", label: "First-time Guest" },
  { value: "other", label: "Other" },
];

const VOLUNTEER_OPTIONS = [
  { value: "none", label: "Not volunteering" },
  { value: "media", label: "Media" },
  { value: "ushers_protocol", label: "Ushers / Protocol" },
  { value: "prayer", label: "Prayer Department" },
  { value: "publicity_mobilization", label: "Publicity and Mobilization" },
  { value: "technical", label: "Technical" },
  { value: "choristers", label: "Choristers" },
  { value: "welfare_hospitality", label: "Welfare / Hospitality" },
];

type Status = "idle" | "submitting" | "success" | "error";

interface FormState {
  fullName: string;
  stateCity: string;
  phone: string;
  email: string;
  describes: string;
  attendance: string;
  volunteer: string;
  expectations: string;
}

const initialState: FormState = {
  fullName: "",
  stateCity: "",
  phone: "",
  email: "",
  describes: "",
  attendance: "",
  volunteer: "none",
  expectations: "",
};

export default function RegistrationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<Status>("idle");

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setForm(initialState);
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-[520px] overflow-y-auto rounded-t-2xl border border-zinc-800 bg-zinc-950 p-6 pb-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] sm:rounded-2xl sm:p-7"
          >
            <div className="mb-1 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-100">Register for ROZYC 2026</h2>
                <p className="text-[13.5px] text-zinc-400">Complete the form below to reserve your seat.</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5">
              <FieldWrapper label="Full name" htmlFor="fullName">
                <TextField
                  id="fullName"
                  placeholder="e.g. Akinde Olugbenga"
                  required
                  value={form.fullName}
                  onChange={(v) => update("fullName", v)}
                />
              </FieldWrapper>

              <FieldWrapper label="State / City" htmlFor="stateCity">
                <TextField
                  id="stateCity"
                  placeholder="e.g. Akure, Ondo State"
                  required
                  value={form.stateCity}
                  onChange={(v) => update("stateCity", v)}
                />
              </FieldWrapper>

              <FieldWrapper label="Phone number" htmlFor="phone">
                <div className="flex gap-2.5">
                  <input
                    value="+234"
                    readOnly
                    aria-label="Country code"
                    className="w-[66px] rounded-[9px] border border-zinc-700 bg-zinc-900/60 px-3 py-3 text-center text-[15px] text-zinc-100 outline-none"
                  />
                  <div className="flex-1">
                    <TextField
                      id="phone"
                      type="tel"
                      placeholder="Phone number"
                      required
                      value={form.phone}
                      onChange={(v) => update("phone", v)}
                    />
                  </div>
                </div>
              </FieldWrapper>

              <FieldWrapper label="Email address" htmlFor="email">
                <TextField
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={(v) => update("email", v)}
                />
              </FieldWrapper>

              <FieldWrapper
                label="Which of the following best describes you?"
                htmlFor="describes"
                hint="Placeholder options — final list pending Phase 1 sign-off."
              >
                <SelectField
                  id="describes"
                  required
                  value={form.describes}
                  onChange={(v) => update("describes", v)}
                  options={DESCRIBES_OPTIONS}
                />
              </FieldWrapper>

              <FieldWrapper label="How will you be attending?">
                <ChoiceRow
                  name="attendance"
                  value={form.attendance}
                  onChange={(v) => update("attendance", v)}
                  options={[
                    { value: "onsite", label: "Onsite" },
                    { value: "online", label: "Online" },
                  ]}
                />
              </FieldWrapper>

              <FieldWrapper
                label="Would you like to volunteer? If so, choose a department"
                htmlFor="volunteer"
              >
                <SelectField
                  id="volunteer"
                  value={form.volunteer}
                  onChange={(v) => update("volunteer", v)}
                  options={VOLUNTEER_OPTIONS}
                />
              </FieldWrapper>

              <FieldWrapper label="What are your expectations for the conference?" htmlFor="expectations">
                <TextAreaField
                  id="expectations"
                  placeholder="Tell us what you hope to learn, experience, or take away"
                  value={form.expectations}
                  onChange={(v) => update("expectations", v)}
                />
              </FieldWrapper>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-2 w-full rounded-[9px] bg-gradient-to-b from-wp-mint to-wp-teal py-3.5 text-base font-bold text-wp-deep transition-[filter] hover:brightness-105 disabled:opacity-70"
              >
                {status === "submitting" ? "Submitting..." : "Submit registration"}
              </button>

              {status === "success" && (
                <p className="mt-3.5 text-center text-[13.5px] text-zinc-400">
                  You're registered! Check your email for confirmation.
                </p>
              )}
              {status === "error" && (
                <p className="mt-3.5 text-center text-[13.5px] text-zinc-400">
                  Something went wrong — please try again or contact us directly.
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
'@

$AppContent = @'
import { useState } from "react";
import Hero from "./components/Hero";
import RegistrationModal from "./components/RegistrationModal";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <Hero onRegister={() => setIsOpen(true)} />
      <RegistrationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </main>
  );
}
'@

Write-Utf8NoBom "src\components\FormField.tsx" $FormFieldContent
Write-Utf8NoBom "src\components\Hero.tsx" $HeroContent
Write-Utf8NoBom "src\components\RegistrationModal.tsx" $ModalContent
Write-Utf8NoBom "src\App.tsx" $AppContent

Write-Host ""
Write-Host "Done. One manual step: save the flyer image (I'm sending it separately) as:" -ForegroundColor Cyan
Write-Host "  src\assets\rozyc-flyer.jpeg" -ForegroundColor Cyan
Write-Host "Then run: npm run dev" -ForegroundColor Cyan
