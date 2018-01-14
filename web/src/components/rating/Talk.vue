<template>
  <div class="talk">
    <div class="title">
      <h3>TODO talk'name</h3>
      {{talk.length}} answer(s)
    </div>
    <div class="graph">
      <bar-chart :data="graphData"></bar-chart>
    </div>
    {{talk.length}} comment(s)
    <ul class="comment-list">
      <li class="comment" v-for="c in talk">
        {{c.comment}}
      </li>
    </ul>
  </div>
</template>

<script>
  import BarChart from '../BarChart';

  export default {
    name: 'talk',
    props: ['talk'],
    data: () => ({
      graphData: {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [
          {
            label: '# of vote(s)',
            backgroundColor: '#c7b299',
            data: [0, 0, 0, 3, 5],
          },
        ],
      },
    }),
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
    width: 400px;
    height: 400px;
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
