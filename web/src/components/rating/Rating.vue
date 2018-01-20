<template>
  <div class="rating">
    <h1>Feedback XKE</h1>
    <p>{{participantCount}} participant(s)</p>
    <p>{{ratingCount}} answer(s)</p>
    <ul>
      <li class="talk" v-for="talk in talks">
        <talk :talk="talk"/>
      </li>
    </ul>
  </div>
</template>

<script>
  import _ from 'lodash';
  import Database from '../../Database';
  import Talk from './Talk';

  export default {
    name: 'rating',
    components: {Talk},
    data: () => ({
      ratingCount: 0,
      participantCount: 0,
      talks: [],
      schedule: [],
    }),
    methods: {
      setRatingCount() {
        _.each(this.talks, (t) => {
          this.ratingCount += t.rating.length;
        });
      },
      setParticipantCount(conf) {
        const participants = {};
        _.each(conf, c => _.each(Object.keys(c), (t) => {
          participants[t] = 1;
        }));
        this.participantCount = Object.keys(participants).length;
      },
      setTalkName() {
        if (_.isEmpty(this.talks)) {
          return;
        }
        _.each(this.talks, (t, i) => {
          this.talks[i].title = _.find(this.schedule, t1 => t.id === t1.id).title;
        });
      },
      transformRating(conf) {
        _.each(Object.keys(conf), k => this.talks.push({id: k, rating: _.toArray(conf[k])}));
      },
    },
    created() {
      this.$http.get('static/schedule.json')
        .then((res) => {
          this.schedule = res.body;
          this.setTalkName();
        });
    },
    firebase: {
      rating: {
        source: Database.ref('rating'),
        asObject: true,
        readyCallback(rating) {
          const r = rating.val();
          const conf = r[Object.keys(r)[0]];
          this.setParticipantCount(conf);
          this.transformRating(conf);
          this.setRatingCount();
          this.setTalkName();
        },
      },
    },
  };
</script>

<style scoped lang="scss">
  h1 {
    margin-top: 20px;
  }

  .rating {
    height: 100%;
    min-height: 86vh;
  }

  .talk {
    margin-top: 20px;
  }
</style>
