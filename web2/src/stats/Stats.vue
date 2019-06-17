<template>
  <section>
    <h1>Stats</h1>
    <div v-if="events" class="past-events">
      <h2>Past events</h2>
      <ul>
        <li v-for="e in events" :key="e">
          <router-link :to="'/rating/'+e">
            {{e}}
          </router-link>
        </li>
      </ul>
    </div>
    <div v-if="rateCountOverTime" class="rate-count-over-time">
      <h2>Rate count over events</h2>
      <line-chart :chart-data="rateCountOverTime"/>
    </div>
  </section>
</template>

<script>
  import _ from 'lodash';
  import firebase from '../firebase';
  import LineChart from './LineChart.vue';

  export default {
    name: 'Stats',
    components: {LineChart},
    data() {
      return {
        rateCountOverTime: null,
        events: null,
      };
    },
    mounted() {
      this.getCounter();
    },
    methods: {
      getCounter() {
        firebase.database().ref('rating').once('value').then(dbConferences => {
          const conferences = dbConferences.val();
          this.rateCountOverTime = {
            labels: [],
            datasets: [
              {
                label: 'Count',
                borderColor: '#9a8a7b',
                backgroundColor: 'rgba(154, 138, 123, .3)',
                data: [],
              },
            ]
          };
          this.events = [];
          Object.keys(conferences).map(key => {
            this.events.push(key);
            const participants = {};
            _.each(conferences[key], c => _.each(Object.keys(c), (t) => {
              participants[t] = 1;
            }));
            this.rateCountOverTime.labels.push(key.split("-")[1]);
            this.rateCountOverTime.datasets[0].data.push(Object.keys(participants).length);
          });
          _.sort(this.events);
        });
      }
    },
  };
</script>

<style scoped lang="scss">
  h1 {
    margin-top: 20px;
  }

  h2 {
    font-size: 1em;
  }

  .past-events {
    margin: 50px auto;
    max-width: 500px;

    ul {
      display: flex;
      flex-wrap: wrap;

      li {
        margin: 10px;

        a {
          text-decoration: none;
          color: #2b2b2b;
        }
      }
    }
  }

  .rate-count-over-time {
    margin: 10px;
    max-height: 600px;
    text-align: center;
  }

  section {
    padding-bottom: 2em;
  }
</style>
