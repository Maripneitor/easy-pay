const path = require('path');

module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    path.join(__dirname, "./App.{js,jsx,ts,tsx}"),
    path.join(__dirname, "./app/**/*.{js,jsx,ts,tsx}"),
    path.join(__dirname, "./components/**/*.{js,jsx,ts,tsx}"),
    path.join(__dirname, "./src/**/*.{js,jsx,ts,tsx}"),
    path.join(__dirname, "../../packages/ui/**/*.{js,jsx,ts,tsx}"),
    path.join(__dirname, "../../packages/domain/**/*.{js,jsx,ts,tsx}")
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
