// Oro motion tokens (mirrors oro-mobile-refresh/src/lib/motion.ts).
// Engine-neutral data — safe in Reanimated worklets and react-navigation config.

export const motion = {
  duration: {
    instant: 80,
    fast: 140,
    normal: 220,
    slow: 320,
    page: 480,
    reveal: 520,
    sheen: 1400,
    crossfade: 320,
    countUp: 720,
  },
  spring: {
    press: { damping: 18, stiffness: 240 },
  },
  stagger: {
    lead: 220,
    step: 70,
    max: 10,
    distance: 28,
  },
  brandCascade: {
    rise: 16,
    duration: 900,
    bloomDuration: 1600,
    bloomDelay: 100,
    delays: { wordmark: 250, tagline: 620, cta: 950, secondary: 1180 },
  },
  easing: {
    standard: [0.2, 0, 0, 1],
    enter: [0, 0, 0.2, 1],
    exit: [0.4, 0, 1, 1],
    spring: [0.34, 1.56, 0.64, 1],
  },
} as const;
