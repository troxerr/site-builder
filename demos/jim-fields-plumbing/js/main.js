/* Jim Fields Plumbing Heating & A/C — site behavior */
(function () {
  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var label = toggle.querySelector('.sr-only');
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      label.textContent = open ? 'Close menu' : 'Open menu';
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
    var desktop = window.matchMedia('(min-width: 960px)');
    var onChange = function (e) { if (e.matches) setOpen(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Service request form
  var form = document.getElementById('service-form');
  if (!form) return;
  var success = document.getElementById('form-success');
  var error = document.getElementById('form-error');
  var button = form.querySelector('button[type="submit"]');
  var buttonText = button.innerHTML;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    error.hidden = true;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (form.elements['bot-field'] && form.elements['bot-field'].value) return; // spam trap

    button.disabled = true;
    button.textContent = 'Sending…';

    // Netlify Forms only exists once deployed; local previews simulate success.
    // Demo copy on bartlettwebsitedesign.online: always simulate, never send.
    var isLocal = true;

    var send = isLocal
      ? Promise.resolve()
      : fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString()
        }).then(function (res) { if (!res.ok) throw new Error('Request failed'); });

    send.then(function () {
      document.getElementById('success-name').textContent = form.elements.name.value.trim().split(' ')[0];
      document.getElementById('success-phone').textContent = form.elements.phone.value.trim();
      form.hidden = true;
      success.hidden = false;
      success.focus();
    }).catch(function () {
      error.hidden = false;
      button.disabled = false;
      button.innerHTML = buttonText;
    });
  });
})();
