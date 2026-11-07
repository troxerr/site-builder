// Tailwind 3 config. tools/build.mjs sets SITE_CONTENT to the rendered pages it compiles for.
module.exports = {
  content: (process.env.SITE_CONTENT || "").split(",").filter(Boolean),
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
