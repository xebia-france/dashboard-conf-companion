import Vue from 'vue';
import Router from 'vue-router';
import Rating from './components/rating/Rating';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: {
        name: 'rating',
      },
    },
    {
      path: '/auth',
      component: () => import(/* webpackChunkName: "auth" */ './components/Auth')
    },
    {
      path: '/rating',
      name: 'rating',
      component: Rating,
    },
    {
      path: '/rating/:id',
      props: true,
      component: Rating,
    },
    {
      path: '/rate',
      component: () => import(/* webpackChunkName: "rate" */ './components/rating/Rate')
    },
    {
      path: '/rate/:id',
      props: true,
      component: () => import(/* webpackChunkName: "rate" */ './components/rating/Rate')
    },
    {
      path: '/stats',
      component: () => import(/* webpackChunkName: "stats" */ './stats/Stats'),
    }
  ],
});
