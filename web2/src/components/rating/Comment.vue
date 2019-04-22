<template>
  <p @click="getName">
    {{comment}}
    <span class="name" v-if="name"><br/>by {{name}}</span>
    <span class="loading" v-if="loading"><br/>⏳ Seeking author...</span>
  </p>
</template>

<script>
  import ky from 'ky';

  export default {
    name: 'Comment',
    props: ['comment', 'uid'],
    data: () => ({
      loading: false,
      name: undefined,
    }),
    methods: {
      async getName() {
        if (['confcompanionwebdev', 'conf-companion'].indexOf(JSON.parse(process.env.VUE_APP_FIREBASE_CONFIGURATION).projectId) >= 0) {
          this.loading = true;
          this.name = (await ky.get(`https://us-central1-conf-companion.cloudfunctions.net/getName?uid=${this.uid}`).json()).name;
          this.loading = false;
        }
      },
    },
  };
</script>

<style scoped>
  p {
    cursor: pointer;
  }

  .loading, .name {
    font-size: 12px;
    opacity: .4;
  }
</style>
