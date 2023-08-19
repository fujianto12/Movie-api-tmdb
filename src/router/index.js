import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import TvShow from "../views/TvShow.vue";
import Movie from "../views/Movie.vue";
import DetailMovie from "../views/DetailMovie.vue"
import DetailTv from "../views/DetailTv.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/TVShow",
      name: "TVshow",
      component: TvShow,
    },
    {
      path: "/Movies",
      name: "Movie",
      component: Movie,
    },
    {
      path: "/detailMovie/:id",
      name: "DetailMovie",
      component: DetailMovie
    },
    {
      path: "/detailTv/:id",
      name: "DetailTv",
      component: DetailTv
    },
  ],
});

export default router;
