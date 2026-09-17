import { motion } from "framer-motion";

const CALENDAR_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE&text=ROZYC%202026%20-%20Beholding&dates=20261128/20261129&details=Rose%20of%20Sharon%20Zonal%20Youths%20Conference%202026.%20Theme%3A%20Beholding.&location=Rose%20of%20Sharon%2C%20Igoba%2C%20Akure";

export default function SuccessScreen({
  fullName,
  attendance,
  onClose,
}: {
  fullName: string;
  attendance: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center px-2 py-4 text-center"
    >
      <motion.svg
        width="76"
        height="76"
        viewBox="0 0 76 76"
        fill="none"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="38"
          cy="38"
          r="34"
          stroke="#3fc9b4"
          strokeWidth="3"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 1 },
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.path
          d="M23 39l10 10 20-22"
          stroke="#3fc9b4"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0 },
            visible: { pathLength: 1 },
          }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.5 }}
        />
      </motion.svg>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="mt-5 text-2xl font-extrabold text-white"
      >
        You're In!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="mt-2 max-w-[320px] text-[15px] text-zinc-300"
      >
        <span className="font-semibold text-white">{fullName}</span>, your
        seat for ROZYC 2026 is confirmed. Get ready - a greater awakening
        awaits.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        className="mt-6 w-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-left"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
          <span className="text-[11px] uppercase tracking-wide text-zinc-500">Theme</span>
          <span className="text-[13.5px] font-semibold text-white">Beholding</span>
        </div>
        <div className="flex items-center justify-between border-b border-zinc-800 py-2.5">
          <span className="text-[11px] uppercase tracking-wide text-zinc-500">Date</span>
          <span className="text-[13.5px] font-semibold text-white">Nov 28, 2026</span>
        </div>
        <div className="flex items-center justify-between pt-2.5">
          <span className="text-[11px] uppercase tracking-wide text-zinc-500">Attending</span>
          <span className="text-[13.5px] font-semibold capitalize text-white">{attendance}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.4 }}
        className="mt-6 flex w-full gap-3"
      >
        
          <a
        
            href={CALENDAR_URL}
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-[9px] bg-wp-teal py-3 text-center text-sm font-bold text-wp-deep transition-colors hover:brightness-105"
        >
          + Add to Calendar
        </a>
        <button
          onClick={onClose}
          className="flex-1 rounded-[9px] border border-zinc-700 py-3 text-sm font-bold text-zinc-200 transition-colors hover:bg-zinc-800"
        >
          Done
        </button>
      </motion.div>
    </motion.div>
  );
}