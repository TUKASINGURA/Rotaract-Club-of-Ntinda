/* ============================================================
   Home page logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderHome();

  const editBtn = document.getElementById('editInfoBtn');
  const form = document.getElementById('infoForm');

  editBtn.addEventListener('click', () => {
    const s = RCN.getSettings();
    document.getElementById('fFounded').value = s.foundedDate;
    document.getElementById('fDays').value = s.meetingDays;
    document.getElementById('fTime').value = s.meetingTime;
    document.getElementById('fVenue').value = s.venue;
    document.getElementById('fMission').value = s.mission;
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    RCN.saveSettings({
      foundedDate: document.getElementById('fFounded').value,
      meetingDays: document.getElementById('fDays').value.trim(),
      meetingTime: document.getElementById('fTime').value.trim(),
      venue: document.getElementById('fVenue').value.trim(),
      mission: document.getElementById('fMission').value.trim()
    });
    document.getElementById('editInfoModal').classList.remove('open');
    rcnToast('Club information updated');
    renderHome();
  });
});

function renderHome(){
  const s = RCN.getSettings();
  const members = RCN.getMembers();
  const activities = RCN.getActivities();

  document.getElementById('missionText').textContent = s.mission;
  document.getElementById('infoFounded').textContent = RCN.formatDate(s.foundedDate);
  document.getElementById('infoMeetingDays').textContent = s.meetingDays;
  document.getElementById('infoMeetingTime').textContent = s.meetingTime || '—';
  document.getElementById('infoVenue').textContent = s.venue || '—';

  const foundedYear = new Date(s.foundedDate).getFullYear();
  document.getElementById('statFounded').textContent = isNaN(foundedYear) ? '—' : foundedYear;

  const memberCount = Object.values(members).reduce((sum, arr) => sum + arr.length, 0);
  document.getElementById('statMembers').textContent = memberCount;
  document.getElementById('statActivities').textContent = activities.length;
  document.getElementById('statMeeting').textContent = (s.meetingDays || '—').split(' ').slice(-1)[0];

  /* Years wheel */
  const yearsActive = RCN.foundedYearsActive();
  const wheelYears = document.getElementById('wheelYears');
  const wheelProgress = document.getElementById('wheelProgress');
  if(yearsActive !== null){
    wheelYears.textContent = yearsActive;
    const circumference = 578; // 2 * PI * r(92)
    const pct = Math.min(yearsActive / 15, 1); // scale visually, caps fill at 15 yrs
    const offset = circumference - (circumference * pct);
    requestAnimationFrame(() => {
      wheelProgress.style.transition = 'stroke-dashoffset 1.1s ease';
      wheelProgress.style.strokeDashoffset = offset;
    });
  } else {
    wheelYears.textContent = '—';
  }

  renderThisMonth(activities);

  /* Activity previews — latest 3 by date */
  const grid = document.getElementById('previewGrid');
  const sorted = [...activities].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,3);
  if(sorted.length === 0){
    grid.innerHTML = `<div class="empty-state">
      <h4>No activities logged yet</h4>
      <p>Add your first club project on the Activities page.</p>
    </div>`;
    return;
  }
  grid.innerHTML = sorted.map(activityCardHTML).join('');
}

function ordinalSuffix(n){
  const v = n % 100;
  if(v >= 11 && v <= 13) return 'th';
  switch(n % 10){
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function renderThisMonth(activities){
  const now = new Date();
  const monthName = now.toLocaleDateString('en-GB',{month:'long'});
  document.getElementById('thisMonthHeading').textContent = `${monthName} @ Ntinda`;

  const inThisMonth = activities.filter(a => {
    const d = new Date(a.date);
    return !isNaN(d) && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).sort((a,b) => new Date(a.date) - new Date(b.date));

  const list = document.getElementById('scheduleList');
  const section = document.getElementById('thisMonthSection');

  if(inThisMonth.length === 0){
    section.style.display = 'none';
    return;
  }
  section.style.display = '';

  list.innerHTML = inThisMonth.map(a => {
    const d = new Date(a.date);
    const day = d.getDate();
    return `
    <div class="schedule-row">
      <div class="ribbon-date">
        <div class="day-wrap">
          <span class="day-num">${day}</span>
          <span class="day-suffix">${ordinalSuffix(day)}</span>
        </div>
      </div>
      <div class="schedule-bar">
        <div>
          <strong>${RCN.escapeHTML(a.title)}</strong>
          <span class="schedule-cat">${RCN.escapeHTML(a.category || '')}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

function activityCardHTML(a){
  const media = a.image
    ? `<img src="${RCN.escapeHTML(a.image)}" alt="${RCN.escapeHTML(a.title)}">`
    : (a.category || 'Activity');
  return `
  <div class="card">
    <div class="card-media">
      <span class="card-tag">${RCN.escapeHTML(a.category || 'Activity')}</span>
      ${media}
    </div>
    <div class="card-body">
      <div class="card-date">${RCN.formatDate(a.date, {year:'numeric',month:'short',day:'numeric'})}</div>
      <h4>${RCN.escapeHTML(a.title)}</h4>
      <p>${RCN.escapeHTML(a.description)}</p>
    </div>
  </div>`;
}
