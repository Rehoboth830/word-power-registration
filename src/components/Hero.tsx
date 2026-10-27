import { motion } from "framer-motion";
import flyer from "../assets/rozyc-flyer.jpeg";

export default function Hero({ onRegister }: { onRegister: () => void }) {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full flex-col" style={{ maxWidth: "min(566px, calc((100dvh - 64px) * 2 / 3))" }}>
      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="shrink-0 overflow-hidden"
        style={{ aspectRatio: "2 / 3", minHeight: "min(calc(100dvh - 64px), 165vw, 850px)" }}
      >
        <img
          src={flyer}
          alt="ROZYC 2026 - Beholding. Rose of Sharon Youths Zonal Conference, Saturday 28th November 2026, 9:00AM, RCCG Rose of Sharon Church Auditorium, Igoba, Akure."
          className="block h-full w-full object-cover"
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        onClick={onRegister}
        className="flex w-full flex-1 items-center justify-center rounded-b-xl bg-black pb-4 pt-4 text-[15px] font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform hover:scale-[1.005] active:scale-[0.99]"
      >
        Register for ROZYC 2026
      </motion.button>
    </div>
  );
}