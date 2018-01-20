<template>
  <div id="app">
    <header></header>
    <section id="body">
      <div class="separator"></div>
      <router-view/>
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

  #app {
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
        background-color: lighten($main-color, 30%);
      }
    }
  }
</style>
