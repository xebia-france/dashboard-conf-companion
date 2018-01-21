<template>
  <div id="firebaseui-auth-container"></div>
</template>

<script>
  import FirebaseUi from 'firebaseui';
  import Firebase from '../Firebase';

  export default {
    name: 'auth',
    mounted() {
      const uiConfig = {
        signInSuccessUrl: '/',
        signInOptions: [
          Firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
      };
      // noinspection JSUnresolvedVariable, JSUnresolvedFunction
      new FirebaseUi.auth.AuthUI(Firebase.auth())
        .start('#firebaseui-auth-container', uiConfig);
    },
  };
</script>

<style scoped>

</style>
