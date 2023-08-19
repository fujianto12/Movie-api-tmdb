<template>
  <section class="tv-series">
    <div class="container">
      <p class="section-subtitle">Best TV Series</p>
      <h2 class="h2 section-title">World Best TV Series</h2>

      <ul class="movies-list">
        <li
          v-for="bestTvShow in bestTvShows"
          :key="bestTvShow.id"
          class="movie-card"
        >
          <router-link :to="'/detailTv/' + bestTvShow.id">
            <figure class="card-banner">
              <img :src="getImageUrl(bestTvShow.poster_path)" />
            </figure>
          </router-link>

          <div class="title-wrapper">
            <router-link :to="'/detailTv/' + bestTvShow.id">
              <h3 class="card-title">{{ bestTvShow.name }}</h3>
            </router-link>
            <time :datetime="bestTvShow.first_air_date">
              {{ getYearFromDate(bestTvShow.first_air_date) }}
            </time>
          </div>

          <div class="card-meta">
            <div class="badge badge-outline">
              <ion-icon name="star"></ion-icon>{{ bestTvShow.vote_average }}
            </div>
            <div class="duration">
              <ion-icon name="time-outline"></ion-icon>
              <time :datetime="getDurationISO(bestTvShow.duration)">
                {{
                  bestTvShow.duration
                    ? formatDuration(bestTvShow.duration)
                    : "N/A"
                }}
              </time>
              {{
                bestTvShow.episode_count
                  ? " | " + bestTvShow.episode_count + " Episodes"
                  : ""
              }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      bestTvShows: [],
      apiKey: "80f9d1266345cf2824ebec75ca64bdb1",
      baseUrl: "https://api.themoviedb.org/3/",
      imageUrl: "https://image.tmdb.org/t/p/w500",
    };
  },
  async mounted() {
    await this.getBestTvShows();
  },
  methods: {
    async getBestTvShows() {
      try {
        const url =
          this.baseUrl +
          "discover/tv?sort_by=popularity.desc&api_key=" +
          this.apiKey;
        const response = await axios.get(url);
        const bestTvShows = response.data.results.slice(0, 4);

        await Promise.all(
          bestTvShows.map(async (bestTvShow) => {
            try {
              const details = await this.getBestTvShowDetail(bestTvShow.id);
              bestTvShow.duration = details.episode_run_time[0]; // Duration in minutes
              bestTvShow.episode_count = details.number_of_episodes; // Episode count
            } catch (error) {
              console.error("Error:", error);
              bestTvShow.duration = 0; // Set duration to 0 if an error occurs
              bestTvShow.episode_count = 0; // Set episode count to 0 if an error occurs
            }
          })
        );

        this.bestTvShows = bestTvShows;
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async getBestTvShowDetail(bestTvShowId) {
      const detailsUrl =
        this.baseUrl + `tv/${bestTvShowId}?api_key=${this.apiKey}`;
      const response = await axios.get(detailsUrl);
      return response.data;
    },
    getImageUrl(posterPath) {
      return this.imageUrl + posterPath;
    },
    getYearFromDate(dateString) {
      const date = new Date(dateString);
      return date.getFullYear();
    },
    formatDuration(durationInMinutes) {
      const minutes = durationInMinutes % 60;
      return `${minutes}m`;
    },
    getDurationISO(durationInMinutes) {
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;
      return `PT${hours}H${minutes}M`;
    },
  },
};
</script>

<style></style>
