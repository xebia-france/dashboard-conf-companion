import Vue from 'vue';
import VueFire from 'vuefire';
import VueResource from 'vue-resource';
import App from './App';
import router from './router';
import firebase from './firebase';

Vue.config.productionTip = false;

Vue.use(VueFire);
Vue.use(VueResource);

(() => new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App},
  methods: {
    goToSignIn() {
      this.$router.push(`/auth?n=${this.$route.path}`);
    },
  },
  beforeCreate() {
    if (process.env.FIREBASE_CONFIGURATION.projectId === 'conf-companion') {
      firebase.auth().onAuthStateChanged((user) => {
        if (user &&
          (user.email.endsWith('xebia.fr') ||
            user.email.endsWith('@zeenea.com') ||
            user.email.endsWith('@publicis.sapient.com'))) {
          this.$router.push(this.$route.fullPath);
        } else if (user) {
          user.delete().then(() => {
            firebase.auth().signOut().then(() => {
              this.goToSignIn();
            });
          });
        } else if (this.$router.path !== '/auth') {
          this.goToSignIn();
        }
      });
    }
  },
}))();
