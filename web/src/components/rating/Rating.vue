<template>
  <div class="rating">
    <h1>Feedback XKE</h1>
    <p>{{participantCount}} participant(s)</p>
    <p>{{ratingCount}} answer(s)</p>
    <transition name="fade">
      <ul v-if="loaded">
        <li class="talk" v-for="talk in talks">
          <talk :talk="talk"/>
        </li>
      </ul>
    </transition>
    <transition name="fade">
      <div v-if="!loaded" class="sk-folding-cube">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
      </div>
    </transition>
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
      loaded: false,
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
          this.loaded = true;
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
        source: Database.ref('rating/xke-20180108/'),
        asObject: true,
        readyCallback(rating) {
          const r = rating.val();
          this.setParticipantCount(r);
          this.transformRating(r);
          debugger;
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

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .sk-folding-cube {
    margin: 25vh auto 0 auto;
    width: 40px;
    height: 40px;
    position: relative;
    -webkit-transform: rotateZ(45deg);
    transform: rotateZ(45deg);
  }

  .sk-folding-cube .sk-cube {
    float: left;
    width: 50%;
    height: 50%;
    position: relative;
    -webkit-transform: scale(1.1);
    -ms-transform: scale(1.1);
    transform: scale(1.1);
  }

  .sk-folding-cube .sk-cube:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fbb03b;
    -webkit-animation: sk-foldCubeAngle 2.4s infinite linear both;
    animation: sk-foldCubeAngle 2.4s infinite linear both;
    -webkit-transform-origin: 100% 100%;
    -ms-transform-origin: 100% 100%;
    transform-origin: 100% 100%;
  }

  .sk-folding-cube .sk-cube2 {
    -webkit-transform: scale(1.1) rotateZ(90deg);
    transform: scale(1.1) rotateZ(90deg);
  }

  .sk-folding-cube .sk-cube3 {
    -webkit-transform: scale(1.1) rotateZ(180deg);
    transform: scale(1.1) rotateZ(180deg);
  }

  .sk-folding-cube .sk-cube4 {
    -webkit-transform: scale(1.1) rotateZ(270deg);
    transform: scale(1.1) rotateZ(270deg);
  }

  .sk-folding-cube .sk-cube2:before {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }

  .sk-folding-cube .sk-cube3:before {
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
  }

  .sk-folding-cube .sk-cube4:before {
    -webkit-animation-delay: 0.9s;
    animation-delay: 0.9s;
  }

  @-webkit-keyframes sk-foldCubeAngle {
    0%, 10% {
      -webkit-transform: perspective(140px) rotateX(-180deg);
      transform: perspective(140px) rotateX(-180deg);
      opacity: 0;
    }
    25%, 75% {
      -webkit-transform: perspective(140px) rotateX(0deg);
      transform: perspective(140px) rotateX(0deg);
      opacity: 1;
    }
    90%, 100% {
      -webkit-transform: perspective(140px) rotateY(180deg);
      transform: perspective(140px) rotateY(180deg);
      opacity: 0;
    }
  }

  @keyframes sk-foldCubeAngle {
    0%, 10% {
      -webkit-transform: perspective(140px) rotateX(-180deg);
      transform: perspective(140px) rotateX(-180deg);
      opacity: 0;
    }
    25%, 75% {
      -webkit-transform: perspective(140px) rotateX(0deg);
      transform: perspective(140px) rotateX(0deg);
      opacity: 1;
    }
    90%, 100% {
      -webkit-transform: perspective(140px) rotateY(180deg);
      transform: perspective(140px) rotateY(180deg);
      opacity: 0;
    }
  }
</style>
