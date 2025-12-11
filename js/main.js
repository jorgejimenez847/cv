// js/main.js

// Año en el footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Tema oscuro / claro
const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const THEME_KEY = "jj_theme";

function applyStoredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark") {
    body.classList.add("dark-theme");
    if (themeToggle) themeToggle.textContent = "☀️";
  } else {
    body.classList.remove("dark-theme");
    if (themeToggle) themeToggle.textContent = "🌙";
  }
}

applyStoredTheme();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark-theme");
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
  });
}
