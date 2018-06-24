<template>
  <div>
    <header></header>
    <section id="body">
      <div class="separator"></div>
      <div class="rating">
        <h1>Feedback {{confName}}</h1>
        <p>{{participantCount}} participant(s)</p>
        <p>{{ratingCount}} answer(s)</p>
        <transition name="fade">
          <ul v-if="loaded && talks.length>0">
            <li class="talk" v-for="talk in talks">
              <talk :talk="talk"/>
            </li>
          </ul>
          <p class="not-available" v-if="loaded && talks.length === 0">No feedback available yet.</p>
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
    </section>
  </div>
</template>

<script>
  import _ from 'lodash';
  import Firebase from '../../Firebase';
  import Talk from './Talk';

  export default {
    name: 'rating',
    components: {Talk},
    props: ['id'],
    data: () => ({
      ratingCount: 0,
      participantCount: 0,
      talks: [],
      schedule: [],
      loaded: false,
      confName: '',
    }),
    created() {
      switch (process.env.FIREBASE_CONFIGURATION.projectId) {
        case 'pcd-cc':
          this.confName = 'Paris Container Day';
          break;
        case 'dataxday-cc':
          this.confName = 'Data X Day';
          break;
        default:
          this.confName = 'XKE';
          break;
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
          this.talks[i].title = _.find(this.schedule, t1 => t.id === t1.id).title;
          this.loaded = true;
        });
      },
      transformRating(conf) {
        _.each(Object.keys(conf), k => this.talks.push({id: k, rating: _.toArray(conf[k])}));
      },
    },
    firebase: {
      conferences: {
        source: Firebase.database().ref('rating/'),
        readyCallback(conferences) {
          const dBConferences = conferences.val();
          if (Object.keys(dBConferences).length > 0) {
            let conferenceId = this.id;
            if (!conferenceId) {
              conferenceId = Object.keys(dBConferences)[Object.keys(dBConferences).length - 1];
            }
            this.$http.get(`static/${conferenceId}.json`)
              .then((res) => {
                this.schedule = res.body;
                this.setTalkName();

                const conference = dBConferences[conferenceId];
                this.setParticipantCount(conference);
                this.transformRating(conference);
                this.setRatingCount();
                this.setTalkName();
              })
              .catch(() => {
                this.loaded = true;
              });
          }
        },
      },
    },
  };
</script>

<style scoped lang="scss">
  $main-color: #2c374c;

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

  header {
    background-color: $main-color;
    width: 100%;
    height: 125px;
  }

  #body {
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
    width: 95%;
    margin: -50px auto 10px auto;
    background-color: #ffffff;
    max-width: 800px;

    .separator {
      height: 10px;
      width: 100%;
      background-color: lighten($main-color, 30%);
    }
  }

  .not-available {
    margin-top: 20%;
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
