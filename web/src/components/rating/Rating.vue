<template>
  <div class="rating">
    <h1>Feedback XKE</h1>
    <p>{{ratingCount}} answer(s)</p>
    <ul>
      <li class="talk" v-for="talk in talks">
        <talk :talk="talk"></talk>
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
      talks: [],
    }),
    firebase: {
      rating: {
        source: Database.ref('rating'),
        asObject: true,
        readyCallback(rating) {
          const r = rating.val();
          const conf = r[Object.keys(r)[0]];
          this.ratingCount = Object.keys(conf).length;
          this.talks = _.map(_.toArray(conf), t => _.toArray(t));
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
    height: 86vh;
  }

  .talk {
    margin-top: 20px;
  }
</style>
