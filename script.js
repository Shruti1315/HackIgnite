/* script.js
   EDITABLE AREAS are clearly marked below.
   - Registration link / QR: update REGISTRATION_URL and ensure assets/qr.png is replaced.
   - Countdown deadline: set DEADLINE_ISO to desired date/time (Asia/Kolkata)
   - Results publishing: see publishResults() helper
   - Logo / Poster filenames: update paths in index.html or here if needed
*/

/* -------------------------
   --- EDIT THESE VALUES ---
   ------------------------- */

/*
  DEADLINE_ISO:
  - Set registration deadline here (ISO 8601 string).
  - Timezone: Asia/Kolkata (UTC+05:30). Example:
    "2025-12-04T23:59:00+05:30"
  - If you leave it null, countdown will show a message to set the date.
*/
const DEADLINE_ISO = "2025-12-04T23:59:00+05:30"; // <-- EDIT THIS

/*
  REGISTRATION_URL:
  - Replace with your Google Form link.
  - Also replace assets/qr.png with QR image that points to this URL (optional).
*/
const REGISTRATION_URL = "https://forms.gle/dJbyP8mcZ4eHjiiX9"; // <-- UPDATED WITH PROVIDED LINK

/* -------------------------
   --- End Editable Area ---
   ------------------------- */

/* Utility: show current year in footer */
document.getElementById('year').textContent = new Date().getFullYear();

/* Register button and QR link behavior */
const registerBtn = document.getElementById('registerBtn');
const regLink = document.getElementById('regLink');

registerBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (REGISTRATION_URL && REGISTRATION_URL.includes('http')) {
    window.open(REGISTRATION_URL, '_blank');
  } else {
    alert('Please set REGISTRATION_URL in script.js to your Google Form.');
  }
});
regLink.addEventListener('click', (e) => {
  e.preventDefault();
  if (REGISTRATION_URL && REGISTRATION_URL.includes('http')) {
    window.open(REGISTRATION_URL, '_blank');
  } else {
    alert('Please set REGISTRATION_URL in script.js to your Google Form.');
  }
});

/* Countdown timer */
const countdownEl = document.getElementById('countdown');

function startCountdown(isoString) {
  if (!isoString) {
    countdownEl.textContent = 'Set deadline in script.js';
    return;
  }
  const deadline = new Date(isoString).getTime();

  function tick() {
    const now = Date.now();
    let diff = deadline - now;
    if (diff <= 0) {
      countdownEl.textContent = 'Registration Closed';
      clearInterval(timerInterval);
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);
    countdownEl.textContent = `${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
  }

  tick();
  const timerInterval = setInterval(tick, 1000);
}

function pad(n) {
  return n.toString().padStart(2, '0');
}

/* Start countdown with DEADLINE_ISO */
startCountdown(DEADLINE_ISO);

/* Table helpers: export CSV / clear placeholders */
function tableToCSV(table) {
  const rows = Array.from(table.querySelectorAll('tr'));
  return rows.map(r => {
    const cells = Array.from(r.querySelectorAll('th, td'));
    return cells.map(c => `"${(c.innerText || '').replace(/"/g,'""')}"`).join(',');
  }).join('\n');
}

document.getElementById('exportCsv').addEventListener('click', () => {
  const csv = tableToCSV(document.getElementById('problemsTable'));
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hackignite_problems.csv';
  a.click();
  URL.revokeObjectURL(url);
});

/* Clear table placeholders (resets contenteditable cells to placeholders) */
document.getElementById('clearTable').addEventListener('click', () => {
  if (!confirm('Clear all problem cells to placeholder text? This cannot be undone.')) return;
  const tbody = document.querySelector('#problemsTable tbody');
  Array.from(tbody.querySelectorAll('tr')).forEach((tr, i) => {
    const tds = tr.querySelectorAll('td');
    if (tds.length >= 4) {
      tds[1].innerText = `Problem ${i + 1} — (edit this cell)`;
      tds[2].innerText = `Category ${(i % 3) + 1}`;
      tds[3].innerText = `100`;
    }
  });
});

/* RESULTS publishing helper
   - You can either:
     1) Remove the 'hidden' class from <section id="results"> in index.html
     2) Use this function to programmatically publish results from an array.
   Example usage (uncomment and edit):
     publishResults([
       { team: 'Team Alpha', prize: '1st Prize' },
       { team: 'Team Beta', prize: '2nd Prize' }
     ]);
*/
function publishResults(resultsArray) {
  if (!Array.isArray(resultsArray) || !resultsArray.length) return;
  const resultsSection = document.getElementById('results');
  const content = document.getElementById('resultsContent');
  // build HTML list
  const ol = document.createElement('ol');
  resultsArray.forEach(r => {
    const li = document.createElement('li');
    li.textContent = `${r.team} — ${r.prize || ''}`;
    ol.appendChild(li);
  });
  content.innerHTML = '';
  content.appendChild(ol);
  resultsSection.classList.remove('hidden');
}

/* Example (commented out) - uncomment & edit to auto-publish
publishResults([
  { team: 'Team Alpha', prize: '1st Prize' },
  { team: 'Team Beta', prize: '2nd Prize' },
  { team: 'Team Gamma', prize: '3rd Prize' }
]);
*/

/* Extra: small fade-in on scroll for sections (subtle animation) */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section').forEach(s => observer.observe(s));

/* Accessibility: pressing Enter on register button opens link */
document.getElementById('registerBtn').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') registerBtn.click();
});
