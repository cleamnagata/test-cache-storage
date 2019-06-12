import Chart from 'chart.js';

const CANVAS_ID = 'stressTestChard';

export default class StressTestChart {
  constructor({ averages, labels, maxList, minList }) {
    this._averages = averages;
    this._labels = labels;
    this._maxList = maxList;
    this._minList = minList;
    this._canvas = document.getElementById(CANVAS_ID);
    if (!this._canvas) {
      this._canvas = document.createElement('canvas');
      this._canvas.width = 400;
      this._canvas.height = 400;
      this._canvas.id = CANVAS_ID;
      document.body.appendChild(this._canvas);
    }
  }

  draw() {
    const ctx = this._canvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this._labels,
        datasets: [
          {
            label: '# average',
            data: this._averages,
            borderWidth: 1,
            backgroundColor: 'rgba(255,183,76,0.5)',
          },
          {
            label: '# min',
            data: this._minList,
            backgroundColor: 'rgba(130,201,169,0.5)',
          },
          {
            label: '# max',
            data: this._maxList,
            backgroundColor: 'rgba(219,39,91,0.5)',
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'cacheStorage.matchAll(url, { ignoreSearch: true }. performance'
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: (value, index, values) => {
                return `${value} ms`
              },
            }
          }]
        }
      }
    });
  }
}