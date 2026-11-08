// Tailwind 3 config. tools/build.mjs sets SITE_CONTENT to the rendered pages it compiles for.
module.exports = {
  content: (process.env.SITE_CONTENT || "").split(",").filter(Boolean),
  theme: {
    extend: {
      // Design tokens: the brand blue is defined once here and in the one CSS rule that needs the raw value (input.css, .nav-panel).
      colors: { brand: '#143fc5' },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
