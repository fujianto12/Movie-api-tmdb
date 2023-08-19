<template>
  <section class="tv-series">
    <div class="container">
      <ul class="filter-list">
        <li>
          <h2 class="h2 section-title-movie">Pilihan Kategori</h2>

          <button
            class="filter-btn"
            v-for="genre in genres"
            :key="genre.id"
            @click="handleCategoryChange(genre.id)"
            :class="{ active: selectedCategory === genre.id }"
          >
            {{ genre.name }}
          </button>
          <button @click="handleCategoryChange('')" class="filter-btn">
            Semua Kategori
          </button>
        </li>
      </ul>

      <p class="section-subtitle">Streaming Online Tv</p>

      <button @click="searchTv" class="search-btn">
        <ion-icon name="search-outline"></ion-icon>

        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name ..."
          class="search-input"
          @input="searchTv"
        />
      </button>

      <template v-if="selectedCategory === ''">
        <ul class="movies-list">
          <li
            v-for="tvShow in tvShows"
            :key="tvShow.id"
            class="movie-card"
            data-aos="fade-down"
          >
            <!-- Your movie card template here -->
            <RouterLink :to="'/detailTv/' + tvShow.id">
              <figure class="card-banner">
                <img :src="getImageUrl(tvShow.poster_path)" />
              </figure>

              <div class="title-wrapper">
                <h3 class="card-title">{{ tvShow.name }}</h3>
                <time :datetime="getYearFromDate(tvShow.first_air_date)">
                  {{ getYearFromDate(tvShow.first_air_date) }}
                </time>
              </div>
            </RouterLink>

            <div class="card-meta">
              <div class="badge badge-outline">
                <ion-icon name="star"></ion-icon>{{ tvShow.vote_average }}
              </div>
              <div class="duration">
                <ion-icon name="time-outline"></ion-icon>
                <time>{{ tvShow.duration ? tvShow.duration : "N/A" }}</time>
              </div>
            </div>
          </li>
        </ul>
      </template>

      <template v-else>
        <div
          v-for="(tvShows, genreId) in tvShowsByGenre"
          :key="genreId"
          class="movies-by-genre"
        >
          <h2 class="h2 section-title">{{ getGenreNameById(genreId) }}</h2>
          <ul class="movies-list">
            <li
              v-for="tvShow in tvShows"
              :key="tvShow.id"
              class="movie-card"
              data-aos="fade-down"
              data-aos-offset="200"
              data-aos-delay="20"
              data-aos-duration="1000"
              data-aos-easing="ease-in-out"
              data-aos-mirror="true"
            >
              <!-- Your movie card template here -->
              <RouterLink :to="'/detailTv/' + tvShow.id">
                <figure class="card-banner">
                  <img :src="getImageUrl(tvShow.poster_path)" />
                </figure>

                <div class="title-wrapper">
                  <h3 class="card-title">{{ tvShow.name }}</h3>

                  <time :datetime="getYearFromDate(tvShow.first_air_date)">
                    {{ getYearFromDate(tvShow.first_air_date) }}
                  </time>
                </div>
              </RouterLink>
              <div class="card-meta">
                <div class="badge badge-outline">{{ tvShow.vote_average }}</div>
                <div class="duration">
                  <ion-icon name="time-outline"></ion-icon>
                  <time>{{ tvShow.duration ? tvShow.duration : "N/A" }}</time>
                  {{ tv }}
                </div>
                <div class="rating">
                  <ion-icon name="star"></ion-icon>
                  <data>{{ tvShow.vote_average }}</data>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </section>
  <Footer />
</template>

<script>
import Footer from "../components/footer.vue";

export default {
  components: {
    Footer,
  },
  data() {
    return {
      tvShows: [],
      apiKey: "80f9d1266345cf2824ebec75ca64bdb1",
      baseUrl: "https://api.themoviedb.org/3/",
      apiUrl: "",
      imageUrl: "https://image.tmdb.org/t/p/w500",
      selectedCategory: "",
      genres: [],
      tvShowsByGenre: {}, // Objek untuk menyimpan daftar film berdasarkan kategori (ID genre)
      searchQuery: ""
    };
  },
  mounted() {
    this.fetchGenres();
    this.apiUrl =
      this.baseUrl +
      "discover/tv?sort_by=popularity.desc&api_key=" +
      this.apiKey;
    this.getTvShows(this.apiUrl);
  },
  methods: {
    fetchGenres() {
      const genresUrl =
        this.baseUrl + `genre/tv/list?api_key=${this.apiKey}&language=id-ID`;
      fetch(genresUrl)
        .then((res) => res.json())
        .then((data) => {
          this.genres = data.genres;
        });
    },

    async getTvShows(url) {
      try {
        const res = await fetch(url);
        const data = await res.json();

        this.tvShows = data.results.map((tvShow) => ({
          ...tvShow,
          duration: "Loading...", // Menampilkan pesan sementara sebelum durasi diambil
        }));
        console.log(data);

        // Ambil durasi untuk setiap acara TV
        await Promise.all(
          data.results.map(async (tvShow, index) => {
            try {
              const details = await this.getTvShowsDetail(tvShow.id);
              this.tvShows[index].duration = this.formatDuration(
                details.episode_run_time
              );
            } catch (error) {
              console.error("Error:", error);
            }
          })
        );
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async getTvShowsDetail(tvShowId) {
      try {
        const detailsUrl = `${this.baseUrl}tv/${tvShowId}?api_key=${this.apiKey}`;
        const res = await fetch(detailsUrl);
        return await res.json();
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async searchTv() {
  if (this.searchQuery.trim() === "") {
    this.selectedCategory = "";
    await this.getTvShows(this.apiUrl);
  } else {
    const searchUrl =
      this.baseUrl +
      `search/tv?api_key=${this.apiKey}&query=${encodeURIComponent(
        this.searchQuery
      )}`;
    try {
      const res = await fetch(searchUrl);
      const data = await res.json();

      if (data.results.length > 0) {
        this.tvShows = await Promise.all(
          data.results.map(async (tvShow) => {
            const details = await this.getTvShowsDetail(tvShow.id);
            return {
              ...tvShow,
              duration: this.formatDuration(details.episode_run_time[0]),
            };
          })
        );
      } else {
        // No search results found
        this.tvShows = [];
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
},


    getImageUrl(posterPath) {
      return this.imageUrl + posterPath;
    },

    getYearFromDate(dateString) {
      const date = new Date(dateString);
      return date.getFullYear();
    },

    async handleCategoryChange(genreId) {
      this.selectedCategory = genreId;

      if (!genreId) {
        this.apiUrl =
          this.baseUrl +
          `discover/tv?sort_by=popularity.desc&api_key=${this.apiKey}`;
      } else {
        this.apiUrl =
          this.baseUrl +
          `discover/tv?sort_by=popularity.desc&api_key=${this.apiKey}&with_genres=${genreId}`;
      }

      // Clear the tvShowsByGenre object
      this.tvShowsByGenre = {};

      try {
        const res = await fetch(this.apiUrl);
        const data = await res.json();

        if (!genreId) {
          this.tvShows = data.results.map((tvShow) => ({
            ...tvShow,
            duration: "Loading...",
          }));

          await Promise.all(
            data.results.map(async (tvShow, index) => {
              try {
                const details = await this.getTvShowsDetail(tvShow.id);
                this.tvShows[index].duration = this.formatDuration(
                  details.episode_run_time[0]
                );
              } catch (error) {
                console.error("Error:", error);
              }
            })
          );
        } else {
          this.tvShowsByGenre[genreId] = data.results;
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },

    getGenreNameById(genreId) {
      if (!genreId) {
        return this.selectedCategory
          ? `Tv Show ${this.getCategoryNameById(this.selectedCategory)}`
          : "All TV Shows";
      }

      return `${this.getCategoryNameById(
        this.selectedCategory
      )} ${this.getCategoryNameById(genreId)}`;
    },

    getCategoryNameById(genreId) {
      const genre = this.genres.find((genre) => genre.id === genreId);
      return genre ? genre.name : "Tv Show";
    },
    formatDuration(durationInMinutes) {
      const minutes = durationInMinutes % 60;
      return `${minutes}m`;
    },
  },
};
</script>

<style></style>
