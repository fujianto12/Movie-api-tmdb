<template>
  <section
    class="movie-detail"
    data-aos="fade-down"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <RouterLink :to="'/Movies'">
      <ion-icon name="arrow-back-outline" class="backMovie"></ion-icon>
    </RouterLink>
    <div class="container">
      <figure class="movie-detail-banner">
        <img :src="getImageUrl(movie.poster_path)" />

        <button class="play-btn" @click="playMovie()">
          <ion-icon name="play-circle-outline"></ion-icon>
        </button>
      </figure>

      <div class="movie-detail-content">
        <p class="detail-subtitle">{{ movie.status }}</p>

        <h1 class="h1 detail-title">{{ movie.title }}</h1>

        <div class="meta-wrapper">
          <div class="badge-wrapper">
            <div class="badge badge-outline">HD</div>
          </div>

          <div class="ganre-wrapper">
            <a v-for="genre in movie.genres" :key="genre.id" href="#">
              {{ genre.name }}
            </a>
          </div>

          <div class="date-time">
            <div>
              <ion-icon name="calendar-outline"></ion-icon>

              <time :datetime="movie.release_date">
                {{ getYearFromDate(movie.release_date) }}
              </time>
            </div>

            <div>
              <ion-icon name="time-outline"></ion-icon>

              <time datetime="PT122M">
                {{ movie.duration ? movie.duration : "N/A" }}
              </time>
            </div>
          </div>
        </div>

        <p class="storyline">
          <!-- <Overview/> -->
        </p>

        <div class="details-actions">
          <button class="share" @click="shareMovie()">
            <ion-icon name="share-social"></ion-icon>

            <span>Share</span>
          </button>

          <div class="title-wrapper">
            <p class="title">Prime Video</p>

            <p class="text">Streaming Channels</p>
          </div>

          <button class="btn btn-primary" @click="watchMovie()">
            <ion-icon name="play"></ion-icon>

            <span>Trailer</span>
          </button>
        </div>

        <a :href="getImageUrl(movie.poster_path)" download class="download-btn">
          <span>Download IMG</span>

          <ion-icon name="download-outline"></ion-icon>
        </a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      movie: null,
      apiKey: "80f9d1266345cf2824ebec75ca64bdb1",
      baseUrl: "https://api.themoviedb.org/3/",
      imageUrl: "https://image.tmdb.org/t/p/w500",
      genres: {},
      backgroundImage: "",
    };
  },
  methods: {
    async fetchMovieDetails(movieId) {
      try {
        const detailsUrl = `${this.baseUrl}movie/${movieId}?api_key=${this.apiKey}&language=id-ID`;
        const res = await fetch(detailsUrl);
        const data = await res.json();

        console.log(data);
        // Replace genre_ids with genre names
        if (data.genre_ids && data.genre_ids.length > 0) {
          data.genres = data.genre_ids.map((genreId) => {
            const genre = this.genres[genreId];
            return genre ? { id: genreId, name: genre } : null;
          });
        }

        this.movie = {
          ...data,
          genres: data.genres,
          duration: this.formatDuration(data.runtime),
        };
        this.backgroundImage = this.getImageUrl(this.movie.backdrop_path);
      } catch (error) {
        console.error("Error:", error);
      }
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
    playMovie() {
      // Implement the logic to play the movie here
      console.log("Playing the movie...");
    },
    shareMovie() {
      if (navigator.share) {
        navigator
          .share({
            title: this.movie.title,
            text: this.movie.overview,
            url: window.location.href,
          })
          .then(() => {
            console.log("Movie shared successfully");
          })
          .catch((error) => {
            console.error("Error sharing movie:", error);
          });
      } else {
        // Fallback behavior if Web Share API is not supported
        console.log("Web Share API is not supported in this browser");
      }
    },

    watchMovie() {
      // Implement the logic to watch the movie here
      console.log("Watching the movie...");
    },
  },
  created() {
    const movieId = this.$route.params.id;

    // Call the fetchMovieDetails method with a valid movie ID
    this.fetchMovieDetails(movieId);
  },
};
</script>

<style>
.backMovie {
  font-size: 40px;
  margin-left: 80px;
  margin-bottom: -10px;
  color: white;
  padding-left: 20px;
}
</style>
