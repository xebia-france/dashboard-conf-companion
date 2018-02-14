import Vue from 'vue';
import Router from 'vue-router';

import Rating from '../components/rating/Rating';
import Auth from '../components/Auth';

// noinspection JSUnresolvedFunction
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'rating',
      },
    },
    {
      path: '/auth',
      component: Auth,
    },
    {
      path: '/rating',
      name: 'rating',
      component: Rating,
    },
  ],
});
