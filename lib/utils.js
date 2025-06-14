import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import confetti from "canvas-confetti"; // 🎉 Confetti import

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function runConfetti() {
  confetti({
    particleCount: 150,
    spread: 60,
    origin: { y: 0.6 },
  });
}
