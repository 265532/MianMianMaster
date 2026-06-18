export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#18C5C7",
          light: "#95E0E1",
          dark: "#14A7A9",
        },
        auxiliary: {
          yellow: "#FFEAC2",
          orange: "#FFC585",
          green: "#A3D47F",
        },
        neutral: {
          bg: "#F8FAFC",
          title: "#1E293B",
          body: "#64748B",
          helper: "#94A3B8",
          border: "#CBD5E1",
        },
      },
      borderRadius: {
        card: "12px",
      },
      spacing: {
        24: "24px",
        16: "16px",
      },
    },
  },
  plugins: [],
};
