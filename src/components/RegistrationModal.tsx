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
  { value: "head_lead_pastor", label: "Head of Ministry / Lead Pastor" },
  { value: "ordained_minister", label: "Ordained Minister" },
  { value: "ministry_worker", label: "Ministry Worker" },
  { value: "music_minister", label: "Music Minister" },
  { value: "marketplace_professional", label: "Marketplace Professional" },
  { value: "business_owner", label: "Business Owner / Entrepreneur" },
  { value: "student", label: "Student" },
  { value: "missionary", label: "Missionary" },
  { value: "others", label: "Others" },
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidNigerianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  // Accepts 10 digits (7031234567) or 11 with a leading 0 (07031234567),
  // and the local mobile prefixes actually start with 7, 8, or 9.
  if (digits.length === 10) return /^[789]/.test(digits);
  if (digits.length === 11) return /^0[789]/.test(digits);
  return false;
}

export default function RegistrationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!form.describes) next.describes = "Please select an option.";
    if (!isValidNigerianPhone(form.phone)) {
      next.phone = "Enter a valid phone number, e.g. 0803 123 4567.";
    }
    if (!isValidEmail(form.email)) {
      next.email = "Enter a valid email address.";
    }
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
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
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5">
              <FieldWrapper label="Full name" htmlFor="fullName">
                <TextField
                  id="fullName"
                  placeholder="Full name"
                  required
                  value={form.fullName}
                  onChange={(v) => update("fullName", v)}
                />
              </FieldWrapper>

              <FieldWrapper label="State / City" htmlFor="stateCity">
                <TextField
                  id="stateCity"
                  placeholder="State / City"
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
                {errors.phone && <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>}
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
                {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
              </FieldWrapper>

              <FieldWrapper
                label="Which of the following best describes you?"
                htmlFor="describes"
              >
                <SelectField
                  id="describes"
                  required
                  value={form.describes}
                  onChange={(v) => update("describes", v)}
                  options={DESCRIBES_OPTIONS}
                />
                {errors.describes && <p className="mt-1.5 text-xs text-red-400">{errors.describes}</p>}
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
                className="mt-2 w-full rounded-[9px] bg-black py-3.5 text-base font-bold text-white transition-colors hover:bg-zinc-900 disabled:opacity-70"
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
                  Something went wrong - please try again or contact us directly.
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}