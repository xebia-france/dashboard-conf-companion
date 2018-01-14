<template>
  <div id="app">
    <header></header>
    <section id="body">
      <div class="separator"></div>
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'app',
  };
</script>

<style lang="scss">
  $main-color: #2c374c;

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
  }

  #app {
    header {
      background-color: $main-color;
      width: 100%;
      height: 125px;
    }

    #body {
      width: 90%;
      margin: -50px auto;
      background-color: #ffffff;
      max-width: 800px;

      .separator {
        height: 10px;
        width: 100%;
        background-color: lighten($main-color, 30%);
      }
    }
  }
</style>
