/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        spark: {
          base: "#070710",
          panel: "#121220",
          panelSoft: "#1b1b2d",
          line: "rgba(255, 255, 255, 0.08)",
          pink: "#ff4d8d",
          orange: "#ff9a3d",
          blue: "#6aa9ff",
          mint: "#6df7c1",
        },
      },
      backgroundImage: {
        "spark-gradient":
          "radial-gradient(circle at top left, rgba(255,77,141,0.24), transparent 32%), radial-gradient(circle at top right, rgba(106,169,255,0.18), transparent 28%), linear-gradient(160deg, #070710 0%, #0f1020 55%, #171935 100%)",
        "spark-card":
          "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))",
        "spark-button": "linear-gradient(135deg, #ff4d8d 0%, #ff9a3d 100%)",
      },
      boxShadow: {
        glow: "0 20px 60px rgba(255, 77, 141, 0.18)",
        panel: "0 18px 50px rgba(4, 8, 24, 0.35)",
      },
      fontFamily: {
        display: ["system-ui", "ui-sans-serif", "sans-serif"],
        body: ["system-ui", "ui-sans-serif", "sans-serif"],
        logo: ["Grand Hotel", "cursive"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(255, 77, 141, 0.18)" },
          "50%": { boxShadow: "0 0 30px rgba(255, 77, 141, 0.34)" },
        },
      },
    },
  },
  plugins: [],
};
