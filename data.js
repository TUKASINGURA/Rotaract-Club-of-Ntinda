/* ============================================================
   Rotaract Club of Ntinda — Data Layer
   Everything is stored in the browser's localStorage, so all
   content added on the site (members, activities, club info)
   is remembered next time it's opened on the same device/browser.
   ============================================================ */

const RCN = (() => {

  const KEYS = {
    settings:'rcn_settings',
    members:'rcn_members',
    activities:'rcn_activities'
  };

  /* ---------- Club settings (edited from the Home page) ---------- */
  const DEFAULT_SETTINGS = {
    clubName:'Rotaract Club of Ntinda',
    foundedDate:'2016-07-16',        // YYYY-MM-DD — edit via the Home page "Edit" button
    meetingDays:'Every 2nd & 4th Saturday',
    meetingTime:'3:00 PM',
    venue:'Ntinda, Kampala',
    mission:'To provide young leaders with opportunities to enhance their knowledge and skills, address the physical and social needs of communities, and promote better relationships between people worldwide through a framework of friendship and service.'
  };

  /* ---------- Sample seed data (only used the very first time,
     so the site never looks empty — edit or delete freely) ---------- */
  const DEFAULT_MEMBERS = {
    '2025-2026':[
      {id:'m1',name:'Add your Club President',role:'President',email:'',photo:''},
      {id:'m2',name:'Add your Club Secretary',role:'Secretary',email:'',photo:''}
    ]
  };

  const DEFAULT_ACTIVITIES = (() => {
    // Sample rows dated for the current month, styled after the club's own
    // monthly flyer format — replace/delete these with real events any time.
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    const pad = n => String(n).padStart(2,'0');
    const d = day => `${y}-${pad(m+1)}-${pad(day)}`;
    return [
      {id:'a1',title:'Club Assembly',date:d(8),category:'Fellowship',
        description:'Monthly club assembly — replace with your own agenda and highlights.',image:''},
      {id:'a2',title:"ADRR's Courtesy Visit",date:d(15),category:'Fellowship',
        description:'Assistant District Rotaract Representative courtesy visit.',image:''},
      {id:'a3',title:"DRR's Official Visit",date:d(22),category:'Fellowship',
        description:'District Rotaract Representative official visit.',image:''},
      {id:'a4',title:'Fun and Games',date:d(29),category:'Community Service',
        description:'Sample: Community Clean-Up Drive style event — edit this to your real project.',image:''}
    ];
  })();

  function readJSON(key, fallback){
    try{
      const raw = localStorage.getItem(key);
      if(!raw) return fallback;
      return JSON.parse(raw);
    }catch(e){
      console.warn('RCN storage read error for', key, e);
      return fallback;
    }
  }
  function writeJSON(key, value){
    try{
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    }catch(e){
      console.warn('RCN storage write error for', key, e);
      return false;
    }
  }

  function getSettings(){ return {...DEFAULT_SETTINGS, ...readJSON(KEYS.settings, {})}; }
  function saveSettings(patch){
    const merged = {...getSettings(), ...patch};
    writeJSON(KEYS.settings, merged);
    return merged;
  }

  function getMembers(){
    const existing = readJSON(KEYS.members, null);
    if(existing === null){ writeJSON(KEYS.members, DEFAULT_MEMBERS); return DEFAULT_MEMBERS; }
    return existing;
  }
  function saveMembers(all){ writeJSON(KEYS.members, all); }

  function getActivities(){
    const existing = readJSON(KEYS.activities, null);
    if(existing === null){ writeJSON(KEYS.activities, DEFAULT_ACTIVITIES); return DEFAULT_ACTIVITIES; }
    return existing;
  }
  function saveActivities(list){ writeJSON(KEYS.activities, list); }

  function uid(prefix='id'){
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  }

  /* ---------- Rotary year helpers (July 1 – June 30 cycle) ---------- */
  function currentRotaryYear(){
    const now = new Date();
    const y = now.getFullYear();
    const startYear = now.getMonth() >= 6 ? y : y - 1; // July = month index 6
    return `${startYear}-${startYear+1}`;
  }
  function rotaryYearRange(back = 4, forward = 1){
    const [startStr] = currentRotaryYear().split('-');
    const start = parseInt(startStr,10);
    const years = [];
    for(let y = start - back; y <= start + forward; y++){
      years.push(`${y}-${y+1}`);
    }
    return years;
  }
  function yearsInUse(){
    const memberYears = Object.keys(getMembers());
    const base = rotaryYearRange();
    return Array.from(new Set([...base, ...memberYears])).sort();
  }
  function foundedYearsActive(){
    const founded = new Date(getSettings().foundedDate);
    if(isNaN(founded)) return null;
    const now = new Date();
    let years = now.getFullYear() - founded.getFullYear();
    const beforeAnniversary = (now.getMonth() < founded.getMonth()) ||
      (now.getMonth() === founded.getMonth() && now.getDate() < founded.getDate());
    if(beforeAnniversary) years -= 1;
    return Math.max(years,0);
  }
  function formatDate(dateStr, opts={year:'numeric',month:'long',day:'numeric'}){
    const d = new Date(dateStr);
    if(isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-GB', opts);
  }
  function initials(name){
    return name.trim().split(/\s+/).slice(0,2).map(w=>w[0]?.toUpperCase()).join('') || '?';
  }
  function escapeHTML(str=''){
    return String(str).replace(/[&<>"']/g, s => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[s]));
  }

  return {
    getSettings, saveSettings,
    getMembers, saveMembers,
    getActivities, saveActivities,
    uid, currentRotaryYear, rotaryYearRange, yearsInUse,
    foundedYearsActive, formatDate, initials, escapeHTML
  };
})();
