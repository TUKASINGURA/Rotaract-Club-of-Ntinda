/* ============================================================
   Shared site behavior — runs on every page
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* Mobile nav toggle */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if(toggle && nav){
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
    }));
  }

  /* Highlight current page in nav */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if(href === path) a.classList.add('active');
  });

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* Generic modal open/close wiring: elements with [data-open-modal="id"] / [data-close-modal] */
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.dataset.openModal);
      if(modal){
        modal.classList.add('open');
        const firstField = modal.querySelector('input,select,textarea');
        if(firstField) setTimeout(()=>firstField.focus(),50);
      }
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if(e.target === overlay) overlay.classList.remove('open');
    });
    overlay.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => overlay.classList.remove('open'));
    });
  });
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){
      document.querySelectorAll('.modal-overlay.open').forEach(o => o.classList.remove('open'));
    }
  });
});

/* Toast helper — used across pages after add/edit/delete actions */
function rcnToast(message){
  let toast = document.querySelector('.toast');
  if(!toast){
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2600);
}
