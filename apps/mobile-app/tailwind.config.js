module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../packages/ui/src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        "cobalt-blue": "#0D47A1",
        "ocean-deep": "#1565C0",
        "brilliant-azure": "#1E88E5",
        "alice-blue": "#E3F2FD",
        "dodger-blue": "#2196F3",
        "sky-blue": "#90CAF9",
        "cool-sky": "#64B5F6",
        primary: "#2196F3",
        secondary: "#64748B",
        "background-light": "#E3F2FD",
        "background-dark": "#0D47A1",
        "neon-violet": "#a855f7",
        "neon-blue": "#2196F3",
      },
    },
  },
  plugins: [],
};
