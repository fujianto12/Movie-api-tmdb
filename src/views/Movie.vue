<template>
  <section class="top-rated">
    <div class="container">
      <ul class="filter-list">
        <li>
          <h2 class="h2 section-title-movie">Pilihan Kategori</h2>
<div class="wrapper-genre">
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
          </div>
        </li>
      </ul>
      <p class="section-subtitle">Streaming Online movie</p>

      <button @click="searchMovies" class="search-btn">
        <ion-icon name="search-outline"></ion-icon>

        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name ..."
          class="search-input"
          @input="searchMovies"
        />
      </button>

      <template v-if="selectedCategory === ''">
        <ul class="movies-list">
          <li
            v-for="movie in movies"
            :key="movie.id"
            class="movie-card"
            data-aos="fade-down"
          >
            <!-- Your movie card template here -->
            <RouterLink :to="'/DetailMovie/' + movie.id">
              <figure class="card-banner">
                <img :src="getImageUrl(movie.poster_path)" />
              </figure>

              <div class="title-wrapper">
                <h3 class="card-title">{{ movie.title }}</h3>
                <time :datetime="getYearFromDate(movie.release_date)">
                  {{ getYearFromDate(movie.release_date) }}
                </time>
              </div>
            </RouterLink>

            <div class="card-meta">
              <div class="badge badge-outline">
                <ion-icon name="star"></ion-icon>{{ movie.vote_average }}
              </div>
              <div class="duration">
                <ion-icon name="time-outline"></ion-icon>
                <time datetime="PT122M">
                  {{ movie.duration ? movie.duration : "N/A" }}
                </time>
              </div>
            </div>
          </li>
        </ul>
      </template>

      <template v-else>
        <div
          v-for="(movies, genreId) in moviesByGenre"
          :key="genreId"
          class="movies-by-genre"
        >
          <h2 class="h2 section-title">{{ getGenreNameById(genreId) }}</h2>
          <ul class="movies-list">
            <li
              v-for="movie in movies"
              :key="movie.id"
              class="movie-card"
              data-aos="fade-down"
              data-aos-offset="200"
              data-aos-delay="20"
              data-aos-duration="1000"
              data-aos-easing="ease-in-out"
              data-aos-mirror="true"
            >
              <!-- Your movie card template here -->
              <RouterLink :to="'/DetailMovie/' + movie.id">
                <figure class="card-banner">
                  <img :src="getImageUrl(movie.poster_path)" />
                </figure>

                <div class="title-wrapper">
                  <h3 class="card-title">{{ movie.title }}</h3>
                  <time :datetime="getYearFromDate(movie.release_date)">
                    {{ getYearFromDate(movie.release_date) }}
                  </time>
                </div>
              </RouterLink>

              <div class="card-meta">
                <div class="badge badge-outline">{{ movie.vote_average }}</div>
                <div class="duration">
                  <ion-icon name="time-outline"></ion-icon>
                  <time :datetime="getYearFromDate(movie.release_date)">
                    {{ movie.duration ? movie.duration : "N/A" }}
                  </time>
                </div>
                <div class="rating">
                  <ion-icon name="star"></ion-icon>
                  <data>{{ movie.vote_average }}</data>
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
import { RouterLink } from "vue-router";

export default {
  components: {
    Footer,
    RouterLink,
  },
  data() {
    return {
      movies: [],
      apiKey: "80f9d1266345cf2824ebec75ca64bdb1",
      baseUrl: "https://api.themoviedb.org/3/",
      apiUrl: "",
      imageUrl: "https://image.tmdb.org/t/p/w500",
      selectedCategory: "",
      genres: [],
      moviesByGenre: {}, // Objek untuk menyimpan daftar film berdasarkan kategori (ID genre)
      searchQuery: "",
    };
  },
  mounted() {
    this.fetchGenres();
    this.apiUrl =
      this.baseUrl +
      "discover/movie?sort_by=popularity.desc&api_key=" +
      this.apiKey;
    this.getMovies(this.apiUrl);
  },
  methods: {
    fetchGenres() {
      const genresUrl =
        this.baseUrl + `genre/movie/list?api_key=${this.apiKey}&language=id-ID`;
      fetch(genresUrl)
        .then((res) => res.json())
        .then((data) => {
          this.genres = data.genres;
        });
    },

    async getMovies(url) {
      try {
        const res = await fetch(url);
        const data = await res.json();

        this.movies = data.results.map((movie) => ({
          ...movie,
          duration: "Loading...", // Menampilkan pesan sementara sebelum durasi diambil
        }));
        console.log(data);

        // Ambil durasi untuk setiap film
        await Promise.all(
          data.results.map(async (movie, index) => {
            try {
              const details = await this.getMovieDetails(movie.id);
              this.movies[index].duration = this.formatDuration(
                details.runtime
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

    async getMovieDetails(movieId) {
      try {
        const detailsUrl = `${this.baseUrl}movie/${movieId}?api_key=${this.apiKey}`;
        const res = await fetch(detailsUrl);
        return await res.json();
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async searchMovies() {
  if (this.searchQuery.trim() === "") {
    // Empty search query, reset the movies list
    this.selectedCategory = "";
    await this.getMovies(this.apiUrl);
  } else {
    // Search for movies by title using TMDb API's search endpoint
    const searchUrl =
      this.baseUrl +
      `search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(
        this.searchQuery
      )}`;
    try {
      const res = await fetch(searchUrl);
      const data = await res.json();

      if (data.results.length > 0) {
        const searchResults = data.results.map((movie) => ({
          ...movie,
          duration: "Loading...",
        }));

        await Promise.all(
          searchResults.map(async (movie, index) => {
            try {
              const details = await this.getMovieDetails(movie.id);
              searchResults[index].duration = this.formatDuration(
                details.runtime
              );
            } catch (error) {
              console.error("Error:", error);
            }
          })
        );

        // Update the movies array with search results
        this.movies = searchResults;
      } else {
        // No search results found
        this.movies = [];
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
          `discover/movie?sort_by=popularity.desc&api_key=${this.apiKey}`;
      } else {
        this.apiUrl =
          this.baseUrl +
          `discover/movie?sort_by=popularity.desc&api_key=${this.apiKey}&with_genres=${genreId}`;
      }

      this.moviesByGenre = {}; // Reset data moviesByGenre

      try {
        const res = await fetch(this.apiUrl);
        const data = await res.json();

        if (!genreId) {
          this.movies = data.results.map((movie) => ({
            ...movie,
            duration: "Loading...",
          }));

          await Promise.all(
            data.results.map(async (movie, index) => {
              try {
                const details = await this.getMovieDetails(movie.id);
                this.movies[index].duration = this.formatDuration(
                  details.runtime
                );
              } catch (error) {
                console.error("Error:", error);
              }
            })
          );
        } else {
          // Filter movies by genreId and get their duration
          const moviesWithGenre = data.results.filter((movie) =>
            movie.genre_ids.includes(genreId)
          );

          this.moviesByGenre[genreId] = moviesWithGenre.map((movie) => ({
            ...movie,
            duration: "Loading...",
          }));

          await Promise.all(
            moviesWithGenre.map(async (movie, index) => {
              try {
                const details = await this.getMovieDetails(movie.id);
                this.moviesByGenre[genreId][index].duration =
                  this.formatDuration(details.runtime);
              } catch (error) {
                console.error("Error:", error);
              }
            })
          );
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },

    getGenreNameById(genreId) {
      if (!genreId) {
        return this.selectedCategory
          ? `All Movies ${this.getCategoryNameById(this.selectedCategory)}`
          : "All Movies";
      }

      return `${this.getCategoryNameById(
        this.selectedCategory
      )} ${this.getCategoryNameById(genreId)}`;
    },

    getCategoryNameById(genreId) {
      const genre = this.genres.find((genre) => genre.id === genreId);
      return genre ? genre.name : "Movies";
    },
    formatDuration(durationInMinutes) {
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;
      return `${hours}h ${minutes}m`;
    },
  },
};
</script>

<style></style>
