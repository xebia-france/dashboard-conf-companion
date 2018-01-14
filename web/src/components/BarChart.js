import {Bar} from 'vue-chartjs';

export default {
  name: 'BarChart',
  extends: Bar,
  props: ['data'],
  mounted() {
    this.renderChart(this.data, {
      scales: {
        yAxes: [{
          ticks: {
            max: 5,
            min: 0,
            stepSize: 1,
          },
        }],
      },
    });
  },
};
