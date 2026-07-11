/* ============================================================
   Members page logic
   ============================================================ */

let currentYear = null;

document.addEventListener('DOMContentLoaded', () => {
  currentYear = RCN.currentRotaryYear();
  populateYearSelects();
  renderMembers();

  document.getElementById('yearSelect').addEventListener('change', e => {
    currentYear = e.target.value;
    renderMembers();
  });
});

function populateYearSelects(){
  const years = RCN.yearsInUse();
  const select = document.getElementById('yearSelect');
  const modalSelect = document.getElementById('mYear');
  const optionsHTML = years.map(y =>
    `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y}${y === RCN.currentRotaryYear() ? ' (current)' : ''}</option>`
  ).join('');
  select.innerHTML = optionsHTML;
  modalSelect.innerHTML = years.map(y =>
    `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y}</option>`
  ).join('');
}

function renderMembers(){
  const members = RCN.getMembers();
  const list = members[currentYear] || [];
  const grid = document.getElementById('membersGrid');

  if(list.length === 0){
    grid.innerHTML = `<div class="empty-state">
      <h4>No members listed for ${currentYear} yet</h4>
      <p>Member data for this year is managed centrally and will appear here.</p>
    </div>`;
    return;
  }

  const roleOrder = ['President','Vice President','Secretary','Treasurer','Sergeant-at-Arms'];
  const sorted = [...list].sort((a,b) => {
    const ai = roleOrder.indexOf(a.role); const bi = roleOrder.indexOf(b.role);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  grid.innerHTML = sorted.map(m => `
    <div class="card member-card">
      <div class="card-media">
        <div class="member-avatar">
          ${m.photo ? `<img src="${RCN.escapeHTML(m.photo)}" alt="${RCN.escapeHTML(m.name)}">` : RCN.initials(m.name)}
        </div>
      </div>
      <div class="card-body">
        <span class="member-role">${RCN.escapeHTML(m.role)}</span>
        <h4>${RCN.escapeHTML(m.name)}</h4>
        ${m.email ? `<p>${RCN.escapeHTML(m.email)}</p>` : ''}
      </div>
    </div>
  `).join('');
}
