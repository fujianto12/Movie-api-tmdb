<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header class="header" data-header>
    <div class="container">
      <div class="overlay" data-overlay></div>

      <a href="/" class="logo-nav">
        <img
          src="./components/images/film-reel.png"
          alt=""
          width="66"
          height="66"
        />
        <h1>Movies</h1>
      </a>

      <div class="header-actions">
        <ul class="social-list">
          <li>
            <a href="https://github.com/fujianto12" class="social-link">
              <ion-icon name="logo-github"></ion-icon>
            </a>
          </li>

          <li>
            <a href="#" class="social-link">
              <ion-icon name="logo-twitter"></ion-icon>
            </a>
          </li>

          <li>
            <a href="#" class="social-link">
              <ion-icon name="logo-pinterest"></ion-icon>
            </a>
          </li>

          <li>
            <a href="#" class="social-link">
              <ion-icon name="logo-linkedin"></ion-icon>
            </a>
          </li>
        </ul>
        <div class="lang-wrapper">
          <label for="language">
            <ion-icon name="globe-outline"></ion-icon>
          </label>

          <select name="language" id="language">
            <option value="en">EN</option>
            <option value="au">AU</option>
            <option value="ar">AR</option>
            <option value="tu">TU</option>
          </select>
        </div>
      </div>

      <button class="menu-open-btn" data-menu-open-btn>
        <ion-icon name="reorder-two"></ion-icon>
      </button>

      <nav class="navbar" data-navbar>
        <div class="navbar-top">
          <a href="/" class="logo-nav">
            <img
              src="./components/images/film-reel.png"
              alt=""
              width="66"
              height="66"
            />
            <h1>Movies</h1>
          </a>

          <button class="menu-close-btn" data-menu-close-btn>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>

        <ul class="navbar-list">
          <li>
            <a href="/" class="navbar-link">Home</a>
          </li>

          <li>
            <RouterLink :to="'/Movies'" class="navbar-link">Movies</RouterLink>
          </li>

          <li>
            <a href="/TvShow" class="navbar-link">TV Show</a>
          </li>
        </ul>

        <ul class="navbar-social-list">
          <li>
            <RouterLink to="#" class="navbar-social-link">
              <ion-icon name="logo-twitter"></ion-icon>
            </RouterLink>
          </li>

          <li>
            <RouterLink to="#" class="navbar-social-link">
              <ion-icon name="logo-facebook"></ion-icon>
            </RouterLink>
          </li>

          <li>
            <RouterLink to="#" class="navbar-social-link">
              <ion-icon name="logo-pinterest"></ion-icon>
            </RouterLink>
          </li>

          <li>
            <RouterLink to="#" class="navbar-social-link">
              <ion-icon name="logo-instagram"></ion-icon>
            </RouterLink>
          </li>

          <li>
            <RouterLink to="#" class="navbar-social-link">
              <ion-icon name="logo-youtube"></ion-icon>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
