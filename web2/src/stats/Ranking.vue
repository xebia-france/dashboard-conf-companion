<template>
  <section class="ranking" v-if="ranking.length>0">
    <h2 class="ranking__title">Ranking by mark and year</h2>
    <ul>
      <li
        v-for="year in ranking"
        :key="Object.keys(year)[0]"
      >
        <h3 class="ranking__subtitle">{{Object.keys(year)[0]}}'s ranking</h3>
        <ol class="ranking__list">
          <li
            v-for="(rank, index) in year[Object.keys(year)[0]]"
            class="ranking__element"
            :key="rank.title+index"
          >
            {{rank.title}} ({{rank.average}}) - {{rank.markCount}} {{rank.markCount > 1 ? 'votes' : 'vote'}}
          </li>
        </ol>
      </li>
    </ul>
  </section>
</template>

<script>
  import ky from 'ky';

  import firebase from '../firebase';

  export default {
    name: 'Ranking',
    data() {
      return {
        ranking: [],
      };
    },
    created: async function () {
      const conferences = (await firebase.database().ref('rating').once('value')).val();

      function toObject() {
        return (accumulator, item) => {
          const key = Object.keys(item)[0];
          accumulator[key] = item[key];
          return accumulator;
        };
      }

      if (Object.keys(conferences).length > 0) {
        const average = Object.keys(conferences)
          .map(conferenceId => ({
            [conferenceId]: Object.keys(conferences[conferenceId])
              .map(talkId => {
                return {
                  id: talkId,
                  total: Object.keys(conferences[conferenceId][talkId])
                    .reduce((accumulator, currentValue) => {
                      let mark = conferences[conferenceId][talkId][currentValue].mark;
                      if (!mark) {
                        mark = 0
                      }
                      return accumulator + mark;
                    }, 0),
                  markCount: Object.keys(conferences[conferenceId][talkId]).length
                }
              })
              .map(talk => ({
                average: (talk.total / talk.markCount).toFixed(2),
                ...talk,
              })),
          }));
        const withTitle = await Promise.all(average.map(async conference => {
          const conferenceId = Object.keys(conference)[0];
          const schedule = await ky.get(`/${conferenceId}.json`).json();
          return {
            [conferenceId]: conference[conferenceId]
              .map(talk => ({
                ...talk,
                ...(schedule.find(s => s.id === talk.id) ?
                  {title: schedule.find(s => s.id === talk.id).title} : {title: '???'}),
              }))
          };
        }));
        const byYear = withTitle.map(conference => {
          const conferenceId = Object.keys(conference)[0];
          return {
            [conferenceId.substring(3, 7)]: conference[conferenceId],
          };
        });
        const groupByYear = byYear.reduce((accumulator, conference) => {
          const conferenceId = Object.keys(conference)[0];
          if (!accumulator[conferenceId]) {
            accumulator[conferenceId] = [];
          }
          accumulator[conferenceId] = [...conference[conferenceId], ...accumulator[conferenceId]];
          return accumulator;
        }, {});
        const sort = Object.keys(groupByYear)
          .map(year =>
            ({[year]: groupByYear[year].sort((a, b) => a.average > b.average ? -1 : 1)}))
          .reduce(toObject(), {});
        this.ranking = Object.keys(sort)
          .map(year => ({[year]: sort[year].slice(0, 50)}))
          .sort((a, b) => parseInt(Object.keys(a)[0], 10) > parseInt(Object.keys(b)[0], 10) ? -1 : 1);
      }
    },
  }
</script>

<style scoped lang="scss">
  .ranking {
    &__title {
      margin: 20px;
    }

    &__list {
      margin: 5px 0 30px;
      text-align: left;
      width: fit-content;
    }

    &__subtitle {
      margin: 15px;
    }

    &__element {
      margin: 25px;

      &:first-of-type {
        color: #d4af37;
        font-weight: 900;
      }

      &:nth-of-type(2) {
        color: #C0C0C0;
        font-weight: 900;
      }

      &:nth-of-type(3) {
        font-weight: 900;
        color: #cd7f32;
      }
    }
  }
</style>
