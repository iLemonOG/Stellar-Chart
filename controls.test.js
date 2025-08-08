const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('controls interactions', () => {
  let dom;
  let chartInstances;

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
    dom = new JSDOM(html, { runScripts: 'outside-only' });
    global.window = dom.window;
    global.document = dom.window.document;
    chartInstances = [];
    global.Chart = dom.window.Chart = class {
      constructor(ctx, config) {
        this.ctx = ctx;
        this.config = config;
        this.destroy = jest.fn();
        chartInstances.push(this);
      }
    };
    window.getComputedStyle = () => ({ getPropertyValue: () => '#000' });
    // Avoid collision with global element ID
    window.eventChart = undefined;
    let dataJs = fs.readFileSync(path.resolve(__dirname, 'data.js'), 'utf8');
    dataJs = dataJs.replace('const eventRates', 'var eventRates');
    dom.window.eval(dataJs);
    const scriptJs = fs.readFileSync(path.resolve(__dirname, 'script.js'), 'utf8');
    dom.window.eval(scriptJs);
  });

  afterEach(() => {
    delete global.window;
    delete global.document;
    delete global.Chart;
  });

  test('changing timeScale rebuilds chart with new data', () => {
    const initialChart = window.eventChart;
    const initialData = initialChart.config.data.datasets[0].data.slice();
    const select = document.getElementById('timeScale');
    select.value = '60';
    select.dispatchEvent(new window.Event('change', { bubbles: true }));
    const newChart = window.eventChart;
    expect(newChart).not.toBe(initialChart);
    expect(newChart.config.data.datasets[0].data).toEqual(initialData.map(v => v * 60));
  });

  test('toggling theme rebuilds chart', () => {
    const initialChart = window.eventChart;
    document.getElementById('toggleTheme').click();
    const newChart = window.eventChart;
    expect(newChart).not.toBe(initialChart);
    expect(document.body.classList.contains('light')).toBe(true);
  });

  test('toggling scale rebuilds chart with log scale', () => {
    const initialChart = window.eventChart;
    document.getElementById('toggleScale').click();
    const newChart = window.eventChart;
    expect(newChart).not.toBe(initialChart);
    expect(newChart.config.options.scales.y.type).toBe('logarithmic');
  });
});
