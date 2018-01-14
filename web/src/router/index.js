import Vue from 'vue';
import Router from 'vue-router';

// noinspection NpmUsedModulesInstalled
import Rating from '@/components/rating/Rating';

// noinspection JSUnresolvedFunction
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'rating',
      component: Rating,
    },
  ],
});
