import './assets/main.css'


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')


"use strict";

// navbar variables

const navOpenBtn = document.querySelector("[data-menu-open-btn]");
const navCloseBtn = document.querySelector("[data-menu-close-btn]");
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");

const navElemArr = [navOpenBtn, navCloseBtn, overlay];

// navbar active movie tvshow home
// Dapatkan semua link navbar
const navBarLinks = document.querySelectorAll('.navbar-link');

// Loop melalui setiap link navbar dan tambahkan event listener
navBarLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Hapus kelas "active" dari semua link navbar
        navBarLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Tambahkan kelas "active" pada link yang diklik
        link.classList.add('active');
    });

    // Periksa URL saat halaman dimuat untuk menetapkan kelas "active" pada link yang sesuai
    if (link.getAttribute('href') === window.location.pathname) {
        link.classList.add('active');
    }
});


for (let i = 0; i < navElemArr.length; i++) {
  navElemArr[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("active");
  });
}

// header sticky

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  window.scrollY >= 10
    ? header.classList.add("active")
    : header.classList.remove("active");
});

// go top

const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  window.scrollY >= 500
    ? goTopBtn.classList.add("active")
    : goTopBtn.classList.remove("active");
});


