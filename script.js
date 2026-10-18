(() => {
  const checks = [...document.querySelectorAll('#check-list input[type="checkbox"]')];
  const count = document.getElementById('progress-count');
  const caption = document.getElementById('progress-caption');
  const bar = document.getElementById('progress-bar');
  const fill = document.getElementById('progress-fill');
  const storageKey = 'bantay-handa-checklist-v1';

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    checks.forEach((check) => { check.checked = saved[check.id] === true; });
  } catch {
    // Checklist remains usable when browser storage is unavailable.
  }

  function updateChecklist() {
    const completed = checks.filter((check) => check.checked).length;
    count.textContent = `${completed} / ${checks.length}`;
    caption.textContent = completed === 1 ? 'item ready' : 'items ready';
    bar.setAttribute('aria-valuenow', String(completed));
    fill.style.width = `${(completed / checks.length) * 100}%`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(checks.map((check) => [check.id, check.checked]))));
    } catch {
      // Checklist remains usable when browser storage is unavailable.
    }
  }
  checks.forEach((check) => check.addEventListener('change', updateChecklist));
  updateChecklist();

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"]')];
  function activateTab(tab, moveFocus = false) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
    if (moveFocus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      activateTab(tabs[nextIndex], true);
    });
  });
})();
