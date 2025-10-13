import arcjet, { detectBot, protectSignup, shield, tokenBucket, validateEmail } from "@arcjet/next";

// Merkezi arcjet konfigürasyonu
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"], // IP bazlı tracking
  rules: [
    shield({ 
      mode: "LIVE",
    }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
  ],
});

// Sign Up için özel koruma
export const arcjetSignUp = aj.withRule(
  protectSignup({
    email: {
      mode: "LIVE",
      block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    },
    rateLimit: {
      mode: "LIVE",
      interval: 60, // 1 dakika
      max: 5, // Maksimum 5 kayıt denemesi
    },
    bots: {
      mode: "LIVE",
      deny: [],
    },
  })
);

// Sign In için özel koruma
export const arcjetSignIn = aj.withRule(
  validateEmail({
    mode: "LIVE",
    block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
  })
).withRule(
  tokenBucket({
    mode: "LIVE",
    refillRate: 10, // 10 token per interval
    interval: 60, // 1 dakika
    capacity: 15, // Maksimum 15 giriş denemesi
  })
);

// Genel API koruması
export const arcjetAPI = aj.withRule(
  tokenBucket({
    mode: "LIVE",
    refillRate: 20,
    interval: 10,
    capacity: 50,
  })
);

