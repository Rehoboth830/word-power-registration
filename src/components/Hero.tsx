import { motion } from "framer-motion";
import flyer from "../assets/rozyc-flyer.jpeg";

export default function Hero({ onRegister }: { onRegister: () => void }) {
  return (
    <div className="mx-auto w-full max-w-[640px]">
      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={flyer}
          alt="Word & Power Conference - Anticipate! The teaser campaign for ROZYC 2026."
          className="block w-full"
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
          <br />- 2 Corinthians 3:18
        </p>
        <p className="mt-1.5 text-[13px] font-semibold text-wp-gold">November 28, 2026</p>
      </motion.div>
    </div>
  );
}