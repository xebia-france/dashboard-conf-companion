<template>
  <div class="rating">
    <h1>Rate your {{conferenceName}}</h1>
    <p>{{id}}</p>
    <transition name="fade">
      <form v-if="loaded && talks.length>0" v-on:submit.prevent="updateTalks(talks)">
        <ul>
          <li class="talk" v-for="talk in talks" :key="talk.id">
            <h3><a :id="talk.id" :href="`#${talk.id}`">{{talk.title}}</a></h3>
            <div class="talk-mark-line">
              <div>
                Mark:
                <label v-for="rate in [1, 2, 3, 4, 5]" :key="rate">
                  <input v-model="talk.rate" v-bind:value="rate" type="radio"/> {{rate}}
                </label>
              </div>
              <button
                type="button"
                class="talk-reset-button"
                v-on:click="resetTalk(talk)"
              >Reset
              </button>
              <textarea
                v-model="talk.comment"
                placeholder="Please, leave a comment for speaker, thank you!"
              ></textarea>
            </div>
          </li>
        </ul>

        <div class="form-submit">
          <button type="submit">Submit</button>
        </div>
      </form>
      <p class="not-available" v-if="loaded && talks.length===0">Cannot rate event yet.</p>
    </transition>
    <Loader :loading="!loaded"/>
  </div>
</template>

<script>
  import firebase from '../../firebase';
  import ky from 'ky';
  import {getConferenceName, getId} from '../../util';
  import Loader from "../../loader/Loader";

  export default {
    name: 'rate',
    components: {Loader},
    props: ['id'],
    data() {
      return {
        loaded: false,
        talks: [],
        conferenceName: getConferenceName(),
      };
    },
    methods: {
      getUserId() {
        const firebaseUser = firebase.auth().currentUser;
        if (firebaseUser) {
          return firebaseUser.uid;
        }
        return getId();
      },
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

          Promise.all(
            talksToUpdate.map((talk) => {
              const object = {};
              if ('comment' in talk) {
                object.comment = talk.comment;
              }

              if ('rate' in talk) {
                object.mark = talk.rate;
              }

              return firebase.database()
              .ref(`rating/${this.id}/${talk.id}/${this.getUserId()}`)
              .set(object);
            }),
          ).then(() => {
            this.loaded = true;
            this.$router.push(`${process.env.VUE_APP_SUBMIT_COMMENT_SUCCESS_ROUTE}/${this.id}`);
          }).catch(() => {
            // eslint-disable-next-line no-alert
            alert('Arg, an error occurred, please contact Support');
          });
        }
      },
      resetTalk(talkToReset) {
        this.talks = this.talks.map(talk => (talk.id !== talkToReset.id ? talk : {
          ...talk,
          rate: undefined,
          comment: '',
        }));
      },
      scrollToTalk() {
        if (window.location.hash) {
          const talkId = window.location.hash.substring(1, window.location.hash.length);
          setTimeout(() => document.getElementById(talkId).scrollIntoView(), 200);
        }
      },
    },
    async created() {
      const conference = (await firebase.database().ref(`rating/${this.id}`).once('value')).val();
      if (this.id) {
        const talks = await ky.get(`/${this.id}.json`).json();
        this.talks = talks.map((talk) => {
          if (conference) {
            const talkFromDB = conference[talk.id] || {};
            if (talkFromDB) {
              const feedback = talkFromDB[this.getUserId()] || {};
              return {
                ...talk,
                comment: feedback.comment || '',
                rate: feedback.mark || undefined,
              };
            }
          }
          return {
            ...talk,
            comment: '',
            rate: undefined,
          };
        });
        this.loaded = true;
        this.scrollToTalk();
      }
    },
    firebase() {
      return {
        conference: {
          source: firebase.database().ref(`rating/${this.id}`),
          readyCallback(conference) {
            if (this.id) {
              this.$http.get(`${this.id}.json`)
              .then((res) => {
                this.talks = res.body.map((talk) => {
                  const talkFromDB = conference.val()[talk.id] || {};
                  const feedback = talkFromDB[this.getUserId()] || {};
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
      };
    },
  };
</script>

<style scoped lang="scss">
  @import "../../variable";

  a {
    color: initial;
    text-decoration: none;
  }

  h1 {
    margin-top: 20px;
  }

  textarea {
    width: 100%;
    height: 100px;
    margin-top: 5px;
    border-radius: 3px;
    border-color: #c1c1c1;
  }

  form {
    margin: 20px;
    text-align: left;
    padding-bottom: 50px;
  }

  .talk-mark-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;

    @media screen and (max-width: 500px) {
      .talk-reset-button {
        margin-top: 0.3em;
        margin-bottom: 0.6em;
        order: 2;
      }
    }
  }

  .talk-reset-button {
    background-color: #B4B4B4;
    opacity: 0.8;

    &:hover, &:focus {
      cursor: pointer;
      opacity: 1;
    }
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

  .form-submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    background: #FFFFFF;
    border-top: 10px solid #EEEEEE;
    padding: 20px 0;
    text-align: center;
    margin-top: 30px;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);

    button {
      cursor: pointer;
      opacity: 1;

      &:hover {
        opacity: .8;
      }
    }
  }

  .not-available {
    margin-top: 20%;
  }
</style>
