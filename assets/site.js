(function () {
  'use strict';

  /* Mobile menu */
  var menu = document.getElementById('site-menu');
  var menuButton = document.querySelector('.menu-toggle');

  function setMenu(open) {
    if (!menu || !menuButton) return;
    menu.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Close' : 'Menu';
  }

  function closeSubmenus(except) {
    document.querySelectorAll('.nav-item.open').forEach(function (item) {
      if (item === except) return;
      item.classList.remove('open');
      var b = item.querySelector('.nav-sub-toggle');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  if (menuButton) {
    menuButton.addEventListener('click', function () {
      setMenu(!menu.classList.contains('open'));
    });
  }

  document.querySelectorAll('.nav-sub-toggle').forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.stopPropagation();
      var item = button.closest('.nav-item');
      var open = !item.classList.contains('open');
      closeSubmenus(item);
      item.classList.toggle('open', open);
      button.setAttribute('aria-expanded', String(open));
    });
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.nav-item')) closeSubmenus(null);
    if (menu && menu.classList.contains('open') &&
        !menu.contains(event.target) && !menuButton.contains(event.target)) {
      setMenu(false);
    }
    if (event.target.closest('.nav-links a, .nav-cta')) {
      setMenu(false);
      closeSubmenus(null);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeSubmenus(null);
      setMenu(false);
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1180) setMenu(false);
  });

  /* Send enquiries to Formspree, then show this site's thank-you page */
  document.querySelectorAll('form.enquiry-form').forEach(function (form) {
    var status = document.createElement('p');
    status.className = 'form-note form-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    form.appendChild(status);
    form.addEventListener('submit', function (e) {
      if (!window.fetch || !window.FormData) return;
      e.preventDefault();
      var button = form.querySelector('button[type="submit"], input[type="submit"]');
      if (button) button.disabled = true;
      status.textContent = 'Sending your enquiry...';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (r.ok) { window.location.href = new URL('thanks.html', document.baseURI).href; return; }
          return r.json().then(function (d) {
            var msg = d && d.errors && d.errors.length ? d.errors.map(function (x) { return x.message; }).join(' ') : '';
            throw new Error(msg);
          });
        })
        .catch(function (err) {
          if (button) button.disabled = false;
          status.textContent = (err && err.message) ? err.message : 'Sorry, your enquiry could not be sent. Please try again in a moment.';
        });
    });
  });

  /* Home hero video and sound button */
  var video = document.querySelector('.hero-video');
  var soundButton = document.querySelector('.hero-sound-toggle');
  if (video) {
    video.muted = true;
    var playing = video.play();
    if (playing && playing.catch) playing.catch(function () {});
  }
  if (video && soundButton) {
    soundButton.addEventListener('click', function () {
      video.muted = !video.muted;
      soundButton.textContent = video.muted ? '🔊 Sound on' : '🔇 Sound off';
      soundButton.setAttribute('aria-label', video.muted ? 'Turn video sound on' : 'Turn video sound off');
      if (!video.muted) {
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      }
    });
  }

})();
