<template>
  <section>
    <div class="rating">
      <h1>Feedback {{conferenceName}}</h1>
      <p>{{participantCount}} participant(s)</p>
      <p>{{ratingCount}} answer(s)</p>
      <transition name="fade">
        <ul v-if="loaded && talks.length>0">
          <li class="talk" v-for="talk in talks" :key="talk.id">
            <talk :talk="talk"/>
          </li>
        </ul>
        <p class="not-available" v-if="loaded && talks.length === 0">No feedback available yet.</p>
      </transition>
      <Loader :loading="!loaded"/>
    </div>
  </section>
</template>

<script>
  import _ from 'lodash';
  import firebase from '../../firebase';
  import Talk from './Talk';
  import ky from 'ky';
  import {getConferenceName} from '../../util';
  import Loader from "../../loader/Loader";

  export default {
    name: 'rating',
    components: {Loader, Talk},
    props: ['id'],
    data: () => ({
      ratingCount: 0,
      participantCount: 0,
      talks: [],
      schedule: [],
      loaded: false,
      conferenceName: getConferenceName(),
    }),
    async created() {
      const dBConferences = (await firebase.database().ref('rating').once('value')).val();
      if (Object.keys(dBConferences).length > 0) {
        let conferenceId = this.id;
        if (!conferenceId) {
          conferenceId = Object.keys(dBConferences)[Object.keys(dBConferences).length - 1];
        }
        this.schedule = await ky.get(`/${conferenceId}.json`).json();
        const conference = dBConferences[conferenceId];
        this.setParticipantCount(conference);
        this.transformRating(conference);
        this.setRatingCount();
        this.setTalkName();
        this.loaded = true;
      }
    },
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
          const talk = _.find(this.schedule, t1 => t.id === t1.id);
          if (talk) {
            this.talks[i].title = talk.title;
          }
          this.loaded = true;
        });
      },
      transformRating(conf) {
        _.each(Object.keys(conf), (k) => {
          const rating = [];
          _.each(Object.keys(conf[k]), async (uid) => {
            rating.push({...conf[k][uid], uid});
          });
          this.talks.push({id: k, rating});
        });
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

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .not-available {
    margin-top: 20%;
  }
</style>
