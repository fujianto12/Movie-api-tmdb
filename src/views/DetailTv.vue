<template>
  <section
    class="movie-detail"
    data-aos="fade-down"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <RouterLink :to="'/TvShow'">
      <ion-icon name="arrow-back-outline" class="backTv"></ion-icon>
    </RouterLink>
    <div class="container">
      <figure class="movie-detail-banner">
        <img :src="getImageUrl(tv.poster_path)" />

        <button class="play-btn" @click="playTV()">
          <ion-icon name="play-circle-outline"></ion-icon>
        </button>
      </figure>

      <div class="movie-detail-content">
        <p class="detail-subtitle">{{ tv.status }}</p>

        <h1 class="h1 detail-title">{{ tv.title }}</h1>

        <div class="meta-wrapper">
          <div class="badge-wrapper">
            <div class="badge badge-fill">PG 13</div>

            <div class="badge badge-outline">HD</div>
          </div>

          <div class="ganre-wrapper">
            <a v-for="genre in tv.genres" :key="genre.id" href="#">
              {{ genre.name }}
            </a>
          </div>

          <div class="date-time">
            <div>
              <ion-icon name="calendar-outline"></ion-icon>

              <time :datetime="tv.first_air_date">
                {{ getYearFromDate(tv.first_air_date) }}
              </time>
            </div>

            <div>
              <ion-icon name="albums-outline"></ion-icon>
              {{ tv.number_of_seasons }}
              Season
            </div>
            <div>
              <ion-icon name="browsers-outline"></ion-icon>
              {{ tv.number_of_episodes }} Episode
            </div>
          </div>
        </div>

        <!-- <p class="storyline">
            {{ tv.overview }}
          </p> -->

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

            <span>Watch Now</span>
          </button>
        </div>

        <a :href="getImageUrl(tv.poster_path)" download class="download-btn">
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
      tv: null,
      apiKey: "80f9d1266345cf2824ebec75ca64bdb1",
      baseUrl: "https://api.themoviedb.org/3/",
      imageUrl: "https://image.tmdb.org/t/p/w500",
      genres: {},
      backgroundImage: "",
    };
  },
  methods: {
    async fetchTvDetails(tvId) {
      try {
        const detailsUrl = `${this.baseUrl}tv/${tvId}?api_key=${this.apiKey}&language=id-ID`;
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

        this.tv = {
          ...data,
          genres: data.genres,
          duration: this.formatDuration(data.runtime),
        };
        this.backgroundImage = this.getImageUrl(this.tv.backdrop_path);
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
    playTV() {
      // Implement the logic to play the movie here
      console.log("Playing the tv...");
    },
    shareTV() {
      // Implement the logic to share the movie here
      console.log("Sharing the tv...");
    },
    watchTV() {
      // Implement the logic to watch the movie here
      console.log("Watching the tv...");
    },
  },
  created() {
    const tvId = this.$route.params.id;

    // Call the fetchMovieDetails method with a valid movie ID
    this.fetchTvDetails(tvId);
  },
};
</script>

<style>
.backTv {
  font-size: 40px;
  margin-left: 80px;
  
  color: white;
  padding-left: 20px;
}
</style>
