// Tailwind 3 config for the homepage. tools/home/build_css.py passes the page to scan in HOME_HTML.
module.exports = {
  content: [process.env.HOME_HTML],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
