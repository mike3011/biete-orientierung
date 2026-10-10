/* Shared navigation and contact form. No analytics or third-party scripts. */
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
if (menu && navigation) {
  const mobile = window.matchMedia('(max-width: 900px)');
  function closeMenu() {
    menu.setAttribute('aria-expanded', 'false');
    menu.textContent = 'Menü';
    navigation.hidden = mobile.matches;
  }
  menu.hidden = false;
  closeMenu();
  mobile.addEventListener('change', closeMenu);
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? 'Schließen' : 'Menü';
    navigation.hidden = !open;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menu.focus();
    }
  });
}
// Keep shared links to the previous private landing page useful.
if (location.pathname === '/' || location.pathname.endsWith('/index.html')) {
  const privateAnchors = ['kopf-herz-koerper', 'weg', 'landkarte', 'gespraech', 'fuer-wen', 'preis'];
  if (privateAnchors.includes(location.hash.slice(1))) {
    location.replace('standortbestimmung.html' + location.hash);
  }
}
const form = document.getElementById('kontakt-form');
if (form) {
  const button = document.getElementById('f-submit');
  const status = document.getElementById('f-msg');
  button.disabled = false;
  function message(text, kind) {
    status.textContent = text;
    status.className = 'form-message ' + kind;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled || form.elements._hp.value) return;
    ['vorname', 'nachname', 'email', 'nachricht'].forEach(name => {
      form.elements[name].value = form.elements[name].value.trim();
    });
    form.elements.telefon.setCustomValidity('');
    if (form.elements.rueckruf.checked && !form.elements.telefon.value.trim()) {
      form.elements.telefon.setCustomValidity('Bitte gib für den Rückruf eine Telefonnummer an.');
    }
    if (!form.reportValidity()) return;
    button.disabled = true;
    button.textContent = 'Wird gesendet …';
    form.setAttribute('aria-busy', 'true');
    message('Deine Nachricht wird übermittelt.', '');
    const value = name => form.elements[name].value.trim();
    // Same endpoint and field contract as MindMike; base64 is not a secret.
    const endpoint = atob('aHR0cHM6Ly9ob29rLmludGVncmF0b3IuYm9vc3Quc3BhY2UvZXcyYXJ1NnE5bGY5N2poenNxZnVnZmJieXRsemx0czE=');
    const payload = {
      source: 'biete-orientierung',
      vorname: value('vorname'), nachname: value('nachname'), email: value('email'),
      telefon: value('telefon'), firma: value('firma'),
      rueckruf: form.elements.rueckruf.checked ? 'ja' : 'nein', nachricht: value('nachricht'),
      dsgvo: true, einwilligung_am: new Date().toISOString(), datenschutz_version: '2026-10-10'
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload), signal: controller.signal
      });
      if (!response.ok) throw new Error('Request rejected');
      message('Danke! Deine Nachricht wurde übermittelt. Ich melde mich bei dir.', 'success');
      form.reset();
    } catch {
      message('Die Übermittlung konnte nicht bestätigt werden. Deine Eingaben bleiben erhalten. Bitte schreib mir direkt an mike@mindmike.de oder ruf unter 0561 / 43027276 an.', 'error');
    } finally {
      clearTimeout(timer);
      button.disabled = false;
      button.textContent = 'Nachricht senden ↗';
      form.removeAttribute('aria-busy');
      status.focus();
    }
  });
  form.elements.telefon.addEventListener('input', () => form.elements.telefon.setCustomValidity(''));
  form.elements.rueckruf.addEventListener('change', () => form.elements.telefon.setCustomValidity(''));
}
