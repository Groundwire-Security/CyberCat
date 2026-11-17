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

  /* Return to this site's own thank-you page after an enquiry */
  document.querySelectorAll('input[name="_next"]').forEach(function (input) {
    input.value = new URL('thanks.html', document.baseURI).href;
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
