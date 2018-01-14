import Vue from 'vue';
import Router from 'vue-router';
import Answers from '@/components/Answers';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'answers',
      component: Answers,
    },
  ],
});
