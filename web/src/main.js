import Vue from 'vue';
import VueFire from 'vuefire';
import VueResource from 'vue-resource';
import App from './App';
import router from './router';
import Firebase from './Firebase';

Vue.config.productionTip = false;

Vue.use(VueFire);
Vue.use(VueResource);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App},
  beforeCreate() {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user && user.email.endsWith('xebia.fr')) {
        this.$router.push(this.$route.fullPath);
      } else if (user) {
        user.delete().then(() => {
          Firebase.auth().signOut().then(() => {
            this.$router.push('/auth');
          });
        });
      } else {
        this.$router.push('/auth');
      }
    });
  },
});
