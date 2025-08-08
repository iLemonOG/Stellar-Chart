const ctx = document.getElementById('eventChart').getContext('2d');
let isLog = false;

function getColors() {
  const style = getComputedStyle(document.body);
  return [
    style.getPropertyValue('--accent1').trim(),
    style.getPropertyValue('--accent2').trim(),
    style.getPropertyValue('--accent3').trim(),
    style.getPropertyValue('--accent4').trim(),
    style.getPropertyValue('--accent5').trim(),
    style.getPropertyValue('--accent6').trim()
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
buildChart(1);

// Controls
document.getElementById('timeScale').addEventListener('change', e => {
  buildChart(parseInt(e.target.value, 10));
});

document.getElementById('toggleTheme').addEventListener('click', () => {
  document.body.classList.toggle('light');
  buildChart(parseInt(document.getElementById('timeScale').value, 10));
});

document.getElementById('toggleScale').addEventListener('click', () => {
  isLog = !isLog;
  buildChart(parseInt(document.getElementById('timeScale').value, 10));
});
