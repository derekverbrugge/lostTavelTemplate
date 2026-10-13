
'use strict';

async function loadPartial(target, file) {
  const host = document.getElementById(target);
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`${response.status}`);
    host.innerHTML = await response.text();
    return true;
  } catch (error) {
    console.error(`Unable to load ${file}:`, error);
    host.textContent = '';
    return false;
  }
}

async function init() {
  await Promise.all([
    loadPartial('site-header', 'header.html'),
    loadPartial('site-footer', 'footer.html')
  ]);

  const year = document.getElementById('copyright-year');
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
    });

    nav.addEventListener('click', e => {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const date = document.querySelector('[name="departure"]');
  if (date) {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    date.min = local.toISOString().slice(0, 10);
  }

  document.querySelectorAll('[data-destination]').forEach(link =>
    link.addEventListener('click', () => {
      document.querySelector('[name="destination"]').value = link.dataset.destination;
    })
  );

  const form = document.getElementById('trip-form');

  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const destination = data.get('destination');
      const departure = data.get('departure');
      const travelers = data.get('travelers');

      const subject = encodeURIComponent(`Trip inquiry: ${destination}`);
      const body = encodeURIComponent(
        `Hello LOST Travel,\n\n` +
        `I'd like to inquire about a trip.\n` +
        `Destination: ${destination}\n` +
        `Departure: ${departure}\n` +
        `Travelers: ${travelers}\n\n` +
        `Please contact me about availability and options.\n`
      );

      document.getElementById('form-status').textContent =
        'Your email app will open with a prepared inquiry. No booking has been made.';

      window.location.href =
        `mailto:derekverbrugge@gmail.com?subject=${subject}&body=${body}`;
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
