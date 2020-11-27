<template>
  <div id="auth">
    <h1>Welcome !</h1>
    <p>Only a <span>Sapient</span> can access this resource,<br/>please use your <code>*@publicissapient.fr$,
      *sapient.com$ (Google)</code> address.</p>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
  import * as firebaseui from 'firebaseui';
  import firebase from '../firebase';

  export default {
    name: 'auth',
    mounted() {
      const uiConfig = {
        signInSuccessUrl: this.$route.query.n,
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
      };
      new firebaseui.auth.AuthUI(firebase.auth())
        .start('#firebaseui-auth-container', uiConfig);
    },
  };
</script>

<style scoped lang="scss">
  #auth {
    position: absolute;
    top: 25%;
    left: 0;
    right: 0;
    background-color: #ffffff;
    padding: 20px;
  }

  p {
    padding: 20px;
  }

  h1 {
    color: #2c374c;
  }

  span {
    color: #6c1d5f;
    font-weight: 700;
  }
</style>
