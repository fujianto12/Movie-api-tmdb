<template>
  <section class="top-rated" data-aos="fade-down">
    <div class="container">
      <div class="flex-wrapper">
        <p class="section-subtitle">Online Streaming</p>

        <h2 class="h2 section-title">Top Rated Movies</h2>

        <ul class="movies-list">
          <li v-for="movie in movies" :key="movie.id" class="movie-card">
            <RouterLink :to="'/detailMovie/' + movie.id">
              <figure class="card-banner">
                <img :src="getImageUrl(movie.poster_path)" />
              </figure>

              <div class="title-wrapper">
                <h3 class="card-title">{{ movie.title }}</h3>
                <time :datetime="movie.release_date">{{
                  getYearFromDate(movie.release_date)
                }}</time>
              </div>
            </RouterLink>

            <div class="card-meta">
              <div class="badge badge-outline">
                <ion-icon name="star"></ion-icon>{{ movie.vote_average }}
              </div>

              <div class="duration">
                <ion-icon name="time-outline"></ion-icon>
                <time :datetime="getDurationISO(movie.duration)">
                  {{ movie.duration ? formatDuration(movie.duration) : "N/A" }}
                </time>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      movies: [],
      apiKey: "80f9d1266345cf2824ebec75ca64bdb1",
      baseUrl: "https://api.themoviedb.org/3/",
      imageUrl: "https://image.tmdb.org/t/p/w500",
    };
  },
  mounted() {
    this.getMovies();
  },
  methods: {
    async getMovies() {
      try {
        const url =
          this.baseUrl +
          "discover/movie?sort_by=popularity.desc&api_key=" +
          this.apiKey;
        const res = await fetch(url);
        const data = await res.json();

        // Fetch detailed information for each movie, including duration
        await Promise.all(
          data.results.slice(0, 4).map(async (movie) => {
            try {
              const details = await this.getMovieDetail(movie.id);
              movie.duration = details.runtime; // Duration in minutes
            } catch (error) {
              console.error("Error:", error);
              movie.duration = 0; // Set duration to 0 if an error occurs
            }
          })
        );

        this.movies = data.results.slice(0, 4);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async getMovieDetail(movieId) {
      const detailsUrl =
        this.baseUrl + `movie/${movieId}?api_key=${this.apiKey}`;
      const res = await fetch(detailsUrl);
      const data = await res.json();
      return data;
    },
    getImageUrl(posterPath) {
      return this.imageUrl + posterPath;
    },
    getYearFromDate(dateString) {
      const date = new Date(dateString);
      return date.getFullYear();
    },
    formatDuration(durationInMinutes) {
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;
      return `${hours}h ${minutes}m`;
    },
    getDurationISO(durationInMinutes) {
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;
      return `PT${hours}H${minutes}M`;
    },
  },
};
</script>
