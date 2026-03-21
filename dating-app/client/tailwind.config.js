/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        spark: {
          base: "#06111a",
          canvas: "#081520",
          ink: "#0d1d2b",
          panel: "#122433",
          panelSoft: "#172b3c",
          line: "rgba(255, 255, 255, 0.08)",
          gold: "#f4c16c",
          coral: "#ff8b6b",
          cyan: "#71dff3",
          mint: "#8ef4d1",
        },
      },
      backgroundImage: {
        "spark-hero":
          "radial-gradient(circle at 12% 18%, rgba(244,193,108,0.18), transparent 28%), radial-gradient(circle at 84% 12%, rgba(113,223,243,0.16), transparent 26%), radial-gradient(circle at 82% 86%, rgba(255,139,107,0.14), transparent 22%), linear-gradient(160deg, #06111a 0%, #081520 38%, #0d1d2b 100%)",
        "spark-gradient":
          "linear-gradient(135deg, rgba(244,193,108,0.96) 0%, rgba(255,139,107,0.92) 56%, rgba(113,223,243,0.9) 100%)",
        "spark-card":
          "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
        "spark-grid":
          "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 24px 60px rgba(255, 139, 107, 0.22)",
        panel: "0 24px 90px rgba(0, 0, 0, 0.28)",
        lift: "0 18px 40px rgba(5, 16, 26, 0.28)",
      },
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "sans-serif"],
        body: ["Manrope", "ui-sans-serif", "sans-serif"],
        logo: ["Grand Hotel", "cursive"],
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        drift: "drift 14s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(255, 139, 107, 0.18)" },
          "50%": { boxShadow: "0 0 36px rgba(113, 223, 243, 0.24)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(0, -18px, 0) scale(1.04)" },
        },
      },
    },
  },
  plugins: [],
};
