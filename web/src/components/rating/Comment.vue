<template>
  <p @click="getName">
    {{comment}}
    <span class="name" v-if="name"><br/>by {{name}}</span>
    <span class="loading" v-if="loading"><br/>⏳ Seeking author...</span>
  </p>
</template>

<script>
  export default {
    name: 'Comment',
    props: ['comment', 'uid'],
    data: () => ({
      loading: false,
      name: undefined,
    }),
    methods: {
      getName() {
        if (['confcompanionwebdev', 'conf-companion'].indexOf(process.env.FIREBASE_CONFIGURATION.projectId) >= 0) {
          this.loading = true;
          this.$http.get(`https://us-central1-conf-companion.cloudfunctions.net/getName?uid=${this.uid}`)
            .then((res) => {
              this.loading = false;
              this.name = res.body.name;
            })
            .catch(() => {
              this.loading = false;
            });
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
