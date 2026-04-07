const Analytics = {
  init() {
    this.attachEventListeners();
  },

  attachEventListeners() {
    const chartButtons = document.querySelectorAll('.chart-btn');
    chartButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        chartButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const period = e.target.getAttribute('data-period');
        UI.renderChart(period);
      });
    });
  }
};
