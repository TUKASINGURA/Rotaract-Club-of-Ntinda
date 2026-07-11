/* ============================================================
   Activities page logic
   ============================================================ */

let activeFilter = 'All';

document.addEventListener('DOMContentLoaded', () => {
  renderActivities();

  document.getElementById('categoryFilters').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if(!chip) return;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    renderActivities();
  });

  document.getElementById('activityForm').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('aTitle').value.trim();
    if(!title) return;
    const activity = {
      id: RCN.uid('a'),
      title,
      date: document.getElementById('aDate').value,
      category: document.getElementById('aCategory').value,
      description: document.getElementById('aDescription').value.trim(),
      image: document.getElementById('aImage').value.trim()
    };
    const activities = RCN.getActivities();
    activities.push(activity);
    RCN.saveActivities(activities);

    document.getElementById('addActivityModal').classList.remove('open');
    e.target.reset();
    renderActivities();
    rcnToast(`"${title}" added`);
  });

  document.getElementById('activitiesGrid').addEventListener('click', e => {
    const btn = e.target.closest('[data-delete-activity]');
    if(!btn) return;
    const id = btn.dataset.deleteActivity;
    const activities = RCN.getActivities();
    const target = activities.find(a => a.id === id);
    if(!target) return;
    if(!confirm(`Remove "${target.title}"?`)) return;
    RCN.saveActivities(activities.filter(a => a.id !== id));
    renderActivities();
    rcnToast('Activity removed');
  });
});

function renderActivities(){
  const all = RCN.getActivities();
  const filtered = activeFilter === 'All' ? all : all.filter(a => a.category === activeFilter);
  const sorted = [...filtered].sort((a,b) => new Date(b.date) - new Date(a.date));
  const grid = document.getElementById('activitiesGrid');

  if(sorted.length === 0){
    grid.innerHTML = `<div class="empty-state">
      <h4>No activities in this category yet</h4>
      <p>Use "Add activity" above to log a project.</p>
    </div>`;
    return;
  }

  grid.innerHTML = sorted.map(a => `
    <div class="card">
      <div class="card-media">
        <span class="card-tag">${RCN.escapeHTML(a.category)}</span>
        ${a.image ? `<img src="${RCN.escapeHTML(a.image)}" alt="${RCN.escapeHTML(a.title)}">` : ''}
      </div>
      <div class="card-body">
        <div class="card-date">${RCN.formatDate(a.date, {year:'numeric',month:'short',day:'numeric'})}</div>
        <h4>${RCN.escapeHTML(a.title)}</h4>
        <p>${RCN.escapeHTML(a.description)}</p>
        <div class="card-actions">
          <button class="btn btn-danger btn-sm" data-delete-activity="${a.id}">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}
