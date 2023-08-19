<template>
  <main>
    <article>      
      <Hero />
      <UpComing />
      <TopRateMovie />
      <TvShow />
    </article>
    <Footer />
    
  </main>
</template>

<script>
import Hero from "../components/home/hero.vue";
import UpComing from "../components/home/upComing.vue";
import TopRateMovie from "../components/home/topRateMovie.vue";
import TvShow from "../components/home/bestTvShow.vue";
import Footer from "../components/footer.vue";

export default {
  components: {
    Hero,
    UpComing,
    TopRateMovie,
    TvShow,
    Footer,
  },
};
</script>

<style></style>
