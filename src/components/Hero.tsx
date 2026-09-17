import { motion } from "framer-motion";
import flyer from "../assets/rozyc-flyer.jpeg";

export default function Hero({ onRegister }: { onRegister: () => void }) {
  return (
    <div className="mx-auto w-full max-w-[640px]">
      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
        style={{ height: "min(calc(100dvh - 64px), 850px)" }}
      >
        <img
          src={flyer}
          alt="Word & Power Conference - Anticipate! The teaser campaign for ROZYC 2026."
          className="block h-full w-full object-cover"
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        onClick={onRegister}
        className="block w-full rounded-b-xl bg-black py-4 text-[15px] font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform hover:scale-[1.005] active:scale-[0.99]"
      >
        Register for ROZYC 2026
      </motion.button>
    </div>
  );
}