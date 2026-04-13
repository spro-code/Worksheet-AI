import type { Variants } from 'framer-motion';

// ── Page-level transitions ────────────────────────────────────────────────────
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.15, ease: 'easeIn' } },
};

// ── Staggered list container ──────────────────────────────────────────────────
export const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
};

// ── Individual list / table row ───────────────────────────────────────────────
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 7 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};

// ── Card grid stagger (CreateMethod, Marketplace) ─────────────────────────────
export const cardGridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ── Tab content fade ──────────────────────────────────────────────────────────
export const tabVariants: Variants = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -4, transition: { duration: 0.12 } },
};

// ── Caseload list ↔ detail slide ─────────────────────────────────────────────
export const slideRight: Variants = {
  initial: { opacity: 0, x: 22 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit:    { opacity: 0, x: -18, transition: { duration: 0.15 } },
};

export const slideLeft: Variants = {
  initial: { opacity: 0, x: -22 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit:    { opacity: 0, x: 18, transition: { duration: 0.15 } },
};

// ── Featured banner ───────────────────────────────────────────────────────────
export const bannerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};
