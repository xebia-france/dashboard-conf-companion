<template>
  <div class="talk">
    <div class="title">
      <h3>{{talk.title}}</h3>
      {{talk.length}} answer(s)
    </div>
    <div class="graph">
      <bar-chart :data="graph"/>
    </div>
    {{comments.length}} comment(s)
    <ul class="comment-list">
      <li class="comment" v-for="c in comments">
        {{c.comment}}
      </li>
    </ul>
  </div>
</template>

<script>
  import _ from 'lodash';
  import BarChart from '../BarChart';

  export default {
    name: 'talk',
    props: ['talk'],
    computed: {
      comments() {
        return _.filter(this.talk.rating, r => !_.isEmpty(r.comment));
      },
      graph() {
        return {
          labels: ['1', '2', '3', '4', '5'],
          datasets: [
            {
              label: '# of vote',
              backgroundColor: '#c7b299',
              data: [
                _.filter(this.talk.rating, t => t.mark === 1).length,
                _.filter(this.talk.rating, t => t.mark === 2).length,
                _.filter(this.talk.rating, t => t.mark === 3).length,
                _.filter(this.talk.rating, t => t.mark === 4).length,
                _.filter(this.talk.rating, t => t.mark === 5).length,
              ],
            },
          ],
        };
      },
    },
    components: {BarChart},
  };
</script>

<style scoped lang="scss">
  .talk {
    text-align: left;
    padding: 10px;
  }

  .graph {
    margin: 10px auto;
    max-width: 400px;
    max-height: 400px;
  }

  .title {
    margin: 10px;
  }

  .comment-list {
    margin: 10px 0;
  }

  .comment {
    background-color: #f1f1f1;
    padding: 10px;
    margin-bottom: 10px;
  }
</style>
