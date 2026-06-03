import { motion, useReducedMotion } from "framer-motion";

/**
 * Hand-drawn animated mascot — a curious student peering out from a stack of
 * books. Staged reveal + restrained micro-gestures (head-turn, blink, wave,
 * floating pencils) inspired by Tone Segurado's homepage rhythm.
 */
export function HeroIllustration() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative aspect-square w-full max-w-[480px] mx-auto"
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="peachSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE3CB" />
            <stop offset="100%" stopColor="#FFD1A8" />
          </linearGradient>
          <linearGradient id="bookA" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E8704A" />
            <stop offset="100%" stopColor="#D85A33" />
          </linearGradient>
          <linearGradient id="bookB" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F4A85E" />
            <stop offset="100%" stopColor="#E68A3A" />
          </linearGradient>
          <linearGradient id="bookC" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2C3E50" />
            <stop offset="100%" stopColor="#1F2D3D" />
          </linearGradient>
        </defs>

        {/* sun / background disc */}
        <motion.circle
          cx="200" cy="180" r="140"
          fill="url(#peachSky)"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 1.1, ease: "easeOut" }}
        />

        {/* floating pencil — orbits gently */}
        <motion.g
          animate={reduce ? {} : { y: [0, -10, 0], rotate: [-8, -2, -8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "70px 110px" }}
        >
          <rect x="40" y="100" width="70" height="14" rx="2" fill="#F4A85E" />
          <polygon points="110,100 130,107 110,114" fill="#2C3E50" />
          <rect x="38" y="100" width="8" height="14" fill="#E8704A" />
        </motion.g>

        {/* floating star */}
        <motion.g
          animate={reduce ? {} : { rotate: [0, 360], scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "330px 90px" }}
        >
          <path d="M330 70 L335 85 L350 88 L338 98 L342 113 L330 105 L318 113 L322 98 L310 88 L325 85 Z"
            fill="#E8704A" />
        </motion.g>

        {/* book stack */}
        <motion.g
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        >
          <rect x="80" y="320" width="240" height="32" rx="3" fill="url(#bookC)" />
          <rect x="92" y="332" width="40" height="3" fill="#F4A85E" opacity="0.6" />

          <rect x="70" y="290" width="260" height="30" rx="3" fill="url(#bookA)" />
          <rect x="82" y="301" width="50" height="3" fill="#FFE3CB" opacity="0.7" />

          <rect x="95" y="262" width="210" height="28" rx="3" fill="url(#bookB)" />
          <rect x="107" y="272" width="36" height="3" fill="#2C3E50" opacity="0.5" />
        </motion.g>

        {/* character — head-turn micro-gesture */}
        <motion.g
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.7, ease: "easeOut" }}
        >
          {/* body / shoulders peeking above books */}
          <path d="M150 262 Q200 230 250 262 L250 270 L150 270 Z" fill="#2C3E50" />

          {/* head group — gentle head turn every ~5s */}
          <motion.g
            animate={reduce ? {} : { rotate: [0, -7, -7, 6, 0, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.18, 0.32, 0.5, 0.7, 1],
            }}
            style={{ transformOrigin: "200px 240px" }}
          >
            {/* hair back */}
            <path d="M158 215 Q160 175 200 170 Q240 175 242 215 L242 235 L158 235 Z"
              fill="#3A2418" />
            {/* face */}
            <ellipse cx="200" cy="225" rx="36" ry="40" fill="#F4C9A0" />
            {/* hair front fringe */}
            <path d="M168 205 Q190 188 232 200 Q224 215 200 213 Q180 215 168 205 Z"
              fill="#3A2418" />
            {/* ear */}
            <ellipse cx="166" cy="232" rx="5" ry="8" fill="#E8B68A" />

            {/* eyes — blink */}
            <motion.g
              animate={reduce ? {} : { scaleY: [1, 1, 0.1, 1, 1, 1, 0.1, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "200px 228px" }}
            >
              <ellipse cx="186" cy="228" rx="2.6" ry="3.4" fill="#1F2D3D" />
              <ellipse cx="212" cy="228" rx="2.6" ry="3.4" fill="#1F2D3D" />
            </motion.g>

            {/* brows */}
            <path d="M180 219 Q186 217 192 219" stroke="#1F2D3D" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <path d="M208 219 Q214 217 220 219" stroke="#1F2D3D" strokeWidth="1.6" fill="none" strokeLinecap="round" />

            {/* cheek glow */}
            <circle cx="178" cy="240" r="4" fill="#E8704A" opacity="0.35" />
            <circle cx="222" cy="240" r="4" fill="#E8704A" opacity="0.35" />

            {/* smile */}
            <path d="M190 246 Q200 254 210 246" stroke="#1F2D3D" strokeWidth="2" fill="none" strokeLinecap="round" />
          </motion.g>

          {/* waving hand */}
          <motion.g
            animate={reduce ? {} : { rotate: [0, 18, -6, 18, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
            style={{ transformOrigin: "260px 270px" }}
          >
            <rect x="252" y="252" width="10" height="28" rx="5" fill="#2C3E50" />
            <circle cx="257" cy="248" r="9" fill="#F4C9A0" />
          </motion.g>
        </motion.g>

        {/* tiny sparkles */}
        {[
          { cx: 90, cy: 200, d: 0 },
          { cx: 320, cy: 200, d: 1.2 },
          { cx: 300, cy: 320, d: 2.1 },
        ].map((s, i) => (
          <motion.circle
            key={i}
            cx={s.cx} cy={s.cy} r="3"
            fill="#E8704A"
            animate={reduce ? {} : { opacity: [0, 1, 0], scale: [0.6, 1.3, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: s.d, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </motion.div>
  );
}
