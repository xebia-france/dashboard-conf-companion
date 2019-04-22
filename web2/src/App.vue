<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import firebase from './firebase';

  export default {
    methods: {
      goToSignIn() {
        this.$router.push(`/auth?n=${this.$route.path}`);
      },
    },
    beforeCreate() {
      if (JSON.parse(process.env.VUE_APP_FIREBASE_CONFIGURATION).projectId === 'conf-companion') {
        firebase.auth().onAuthStateChanged((user) => {
          if (user &&
            (user.email.endsWith('xebia.fr') ||
              user.email.endsWith('@zeenea.com') ||
              user.email.endsWith('@sapient.com'))) {
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
  };
</script>

<style lang="scss">
  body {
    margin: 0;
    padding: 0;
    background-color: #f1f1f1;
    text-align: center;
    font-family: 'Lato', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5 {
    font-family: 'Oswald', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 0;
  }

  p {
    margin: 0;
    padding: 0;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  button {
    background-color: #2c374c;
    color: #ffffff;
    padding: 10px 30px;
    border: none;
    border-radius: 2px;
    text-transform: uppercase;
  }
</style>
