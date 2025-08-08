import { eventRates } from './data.mjs';
const ctx = document.getElementById('eventChart').getContext('2d');
let isLog = false;

function loadTheme() {
  try {
    return localStorage.getItem('theme');
  } catch {
    return null;
  }
}

function saveTheme(mode) {
  try {
    localStorage.setItem('theme', mode);
  } catch {
    // localStorage might be unavailable
  }
}

function getColors() {
  return [
    getComputedStyle(document.body).getPropertyValue('--accent1'),
    getComputedStyle(document.body).getPropertyValue('--accent2'),
    getComputedStyle(document.body).getPropertyValue('--accent3'),
    getComputedStyle(document.body).getPropertyValue('--accent4'),
    getComputedStyle(document.body).getPropertyValue('--accent5'),
    getComputedStyle(document.body).getPropertyValue('--accent6')
  ];
}

function buildChart(multiplier) {
  if (window.eventChart) window.eventChart.destroy();

  window.eventChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: eventRates.map(e => e.name),
      datasets: [{
        label: 'Events',
        data: eventRates.map(e => e.value * multiplier),
        backgroundColor: getColors()
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          type: isLog ? 'logarithmic' : 'linear',
          beginAtZero: true,
          grace: '10%'
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'nearest', intersect: false }
      }
    }
  });
}

// Initial load
const storedTheme = loadTheme();
if (storedTheme === 'light') {
  document.body.classList.add('light');
}
buildChart(1);

// Controls
document.getElementById('timeScale').addEventListener('change', e => {
  buildChart(parseInt(e.target.value, 10));
});

document.getElementById('toggleTheme').addEventListener('click', () => {
  document.body.classList.toggle('light');
  saveTheme(document.body.classList.contains('light') ? 'light' : 'default');
  buildChart(parseInt(document.getElementById('timeScale').value, 10));
});

document.getElementById('toggleScale').addEventListener('click', () => {
  isLog = !isLog;
  buildChart(parseInt(document.getElementById('timeScale').value, 10));
});
