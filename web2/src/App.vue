<template>
  <div id="app">
    <header></header>
    <section id="body">
      <div data-v-530a270f="" class="separator"></div>
      <router-view/>
    </section>
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
            (user.email.endsWith('@xebia.fr') ||
              user.email.endsWith('@publicissapient.fr') ||
              user.email.endsWith('@publicis.sapient.com') ||
              user.email.endsWith('@publicissapient.com'))) {
            this.$router.push(this.$route.fullPath).catch(() => {
            });
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
$main-color: #000000;

@font-face {
  font-family: 'Futura Next';
  font-style: normal;
  font-weight: normal;
  src: url('https://static.engineering.publicissapient.fr/fonts/FuturaNext_Book.otf');
}

body {
  margin: 0;
  padding: 0;
  background-color: #E6E6E6;
  text-align: center;
  font-family: 'Futura Next', serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5 {
  font-family: 'Futura Next', serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  margin: 0;
  padding: 0;
}

h1 {
  font-size: 36px;
  text-transform: uppercase;
}

h3 {
  font-size: 18px;
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
  background-color: #FE414D;
  color: #ffffff;
  padding: 10px 30px;
  border: none;
  border-radius: 2px;
  text-transform: uppercase;
  font-family: 'Futura Next', serif;
}

header {
  background-color: $main-color;
  width: 100%;
  height: 125px;
}

#body {
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
  width: 95%;
  margin: -50px auto 10px auto;
  background-color: #ffffff;
  max-width: 800px;

  .separator {
    height: 10px;
    width: 100%;
    background-color: #FE414D;
  }
}
</style>
