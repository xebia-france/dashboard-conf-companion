<template>
  <div class="talk">
    <div class="title">
      <h3>{{talk.title}}</h3>
      {{talk.rating.length}} answer(s)
    </div>
    <div class="graph">
      <bar-chart :data="graph"/>
    </div>
    {{comments.length}} comment(s)
    <ul class="comment-list">
      <li class="comment" v-for="c in comments" :key="c.id">
        <table>
          <tr>
            <td class="badge"><span v-if="c.mark">{{c.mark}}</span></td>
            <td>
              <comment :comment="c.comment" :uid="c.uid"/>
            </td>
          </tr>
        </table>
      </li>
    </ul>
  </div>
</template>

<script>
  import _ from 'lodash';
  import BarChart from '../BarChart';
  import Comment from './Comment';

  export default {
    name: 'talk',
    props: ['talk'],
    computed: {
      comments() {
        return _.orderBy(_.filter(this.talk.rating, r => !_.isEmpty(r.comment)), 'mark', ['desc']);
      },
      graph() {
        return {
          labels: ['1', '2', '3', '4', '5'],
          datasets: [
            {
              label: '# of vote',
              backgroundColor: '#FE414D',
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
    components: {Comment, BarChart},
  };
</script>

<style scoped lang="scss">
  @import "../../variable";

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

    h3 {
      margin-bottom: 5px;
    }
  }

  .comment-list {
    margin: 10px 0;
  }

  .comment {
    background-color: #f1f1f1;
    padding: 10px;
    margin-bottom: 10px;
  }

  .badge {
    span {
      background-color: $tertiary-color;
      color: white;
      display: block;
      height: 25px;
      width: 25px;
      border-radius: 100%;
      margin-right: 10px;
      text-align: center;
      line-height: 28px;
    }
  }
</style>
