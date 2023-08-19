<template>
  <section class="hero" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="container">
      <div class="hero-content">
        <p class="hero-subtitle">{{ currentMovie.title }}</p>
        <h1 class="h1 hero-title">
          Unlimited <strong>Movie</strong>, TVs Shows, & More.
        </h1>
        <div class="meta-wrapper">
          <div class="badge-wrapper">
            <div class="badge badge-outline">HD</div>
          </div>
          <div class="ganre-wrapper">
            <a href="#">{{ currentMovie.genre }}</a>
          </div>
          <div class="date-time">
            <div>
              <ion-icon name="calendar-outline"></ion-icon>
              <time :datetime="currentMovie.release_date">
                {{ currentMovie.release_date }}
              </time>
            </div>
            <div>
              <ion-icon name="time-outline"></ion-icon>
              <time :datetime="'PT' + currentMovie.duration + 'M'"
                >{{ currentMovie.duration }} min</time
              >
            </div>
            <div>
              <p class="overview-hero">{{ currentMovie.overview }}</p>
            </div>
          </div>
        </div>
        <RouterLink :to="'/DetailMovie/' + currentMovie.id">
          <button class="btn btn-primary">
            <ion-icon name="play"></ion-icon>
            <span>Watch now</span>
          </button>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      movies: [],
      currentMovie: {},
      currentIndex: 0,
      timer: null,
      apiKey: "80f9d1266345cf2824ebec75ca64bdb1",
      baseUrl: "https://api.themoviedb.org/3/",
      backgroundImage: "",
    };
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await axios.get(this.baseUrl + "discover/movie", {
          params: {
            api_key: this.apiKey,
            sort_by: "popularity.desc",
          },
        });

        this.movies = response.data.results;
        this.currentMovie = this.movies[this.currentIndex];
        await this.fetchMovieDetails(this.currentMovie.id);

        this.startAutoChange();
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    },
    getImageUrl(path, size) {
      return `https://image.tmdb.org/t/p/${size}${path}`;
    },
    async fetchMovieDetails(movieId) {
      try {
        const response = await axios.get(this.baseUrl + `movie/${movieId}`, {
          params: {
            api_key: this.apiKey,
          },
        });

        this.currentMovie.genre = response.data.genres
          .map((genre) => genre.name)
          .join(", ");
        this.currentMovie.duration = response.data.runtime;
        this.backgroundImage = this.getImageUrl(
          this.currentMovie.backdrop_path,
          "original"
        );
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    },
    startAutoChange() {
      this.timer = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.movies.length;
        this.currentMovie = this.movies[this.currentIndex];
        this.fetchMovieDetails(this.currentMovie.id);
      }, 5000); // Change movie every 5 seconds
    },
    stopAutoChange() {
      clearInterval(this.timer);
    },
  },
  created() {
    this.fetchMovies();
  },
  beforeDestroy() {
    this.stopAutoChange();
  },
  getYearFromDate(dateString) {
    const date = new Date(dateString);
    return date.getFullYear();
  },
};
</script>

<style>
/* Add your styles here */
</style>
