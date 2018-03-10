<template>
  <div>
    <header></header>
    <section id="body">
      <div class="separator"></div>
      <div class="rating">
        <h1>Feedback XKE</h1>
        <transition name="fade">
          <form
            v-if="loaded && talks.length>0"
            v-on:submit.prevent="updateTalks(talks)"
          >
            <ul>
              <li class="talk" v-for="talk in talks">
                <h3>{{talk.title}}</h3>
                <div class="form-section">
                  <h5>Note :</h5>
                  <label v-for="rate in [1, 2, 3, 4, 5]">
                    <input v-model="talk.rate" v-bind:value="rate" type="radio"/> {{rate}}
                  </label>
                </div>

                <div class="form-section">
                  <textarea v-model="talk.comment" placeholder="Un commentaire ?"></textarea>
                </div>
              </li>
            </ul>

            <div class="form-section">
              <button type="submit">Valider</button>
            </div>
          </form>
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
  import Firebase from '../../Firebase';

  export default {
    name: 'rate',
    props: ['id'],
    data() {
      return {
        loaded: false,
        talks: [],
      };
    },
    methods: {
      updateTalks(talks) {
        const talksToUpdate = talks.map((talk) => {
          const talkToUpdate = {
            id: talk.id,
            conferenceId: talk.conferenceId,
          };

          const rate = parseInt(talk.rate, 10);
          if (rate >= 1 && rate <= 5) {
            talkToUpdate.rate = rate;
          }

          const comment = (talk.comment || '').trim();
          if (comment.length > 0) {
            talkToUpdate.comment = comment;
          }

          return talkToUpdate;
        }).filter(talk => ('comment' in talk) || ('rate' in talk));

        if (talksToUpdate.length > 0) {
          this.loaded = false;
          const uid = Firebase.auth().currentUser.uid;

          Promise.all(
            talksToUpdate.map((talk) => {
              const object = {};
              if ('comment' in talk) {
                object.comment = talk.comment;
              }

              if ('rate' in talk) {
                object.mark = talk.rate;
              }

              return Firebase.database()
                .ref(`rating/${talk.conferenceId}/${talk.id}/${uid}`)
                .set(object);
            }),
          ).then(() => {
            this.loaded = true;
            this.$router.push('/rating');
          }).catch((err) => {
            // eslint-disable-next-line no-alert
            alert('Une erreur est survenue pendant la soumission du formulaire.');
            // eslint-disable-next-line no-console
            console.log(err);
          });
        }
      },
    },
    firebase: {
      conferences: {
        source: Firebase.database().ref('rating/'),
        readyCallback(conferences) {
          const uid = Firebase.auth().currentUser.uid;
          const dBConferences = conferences.val();
          if (Object.keys(dBConferences).length > 0) {
            let conferenceId = this.id;
            if (!conferenceId) {
              conferenceId = Object.keys(dBConferences)[Object.keys(dBConferences).length - 1];
            }

            const conference = dBConferences[conferenceId];

            this.$http.get(`static/${conferenceId}.json`)
              .then((res) => {
                this.talks = res.body.map((talk) => {
                  const talkFromDB = conference[talk.id] || {};
                  const feedback = talkFromDB[uid] || {};

                  return {
                    ...talk,
                    comment: feedback.comment || '',
                    rate: feedback.mark || undefined,
                  };
                });
                this.loaded = true;
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

  h3 {
    margin-bottom: 12px;
  }

  textarea{
    min-height: 100px;
    max-width: 80%;
    min-width: 80%;
  }

  .rating {
    height: 100%;
    min-height: 86vh;
    padding-bottom: 20px;
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

  .form-section+.form-section {
    margin-top: 12px;
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
