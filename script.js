const apiKey = "76bf5ae0fe4ac6421107329e51c447d7"; // Replace with your GNews key
const newsContainer = document.getElementById("newsContainer");
const categoryLinks = document.querySelectorAll("nav ul li a");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

// Fetch news by category
async function fetchNews(category = "general") {
    showSkeleton();
    try {
        const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=in&apikey=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        displayNews(data.articles);
    } catch (error) {
        newsContainer.innerHTML = "<p>Failed to load news 😢</p>";
    }
}


// Fetch news by search
async function searchNews(query) {
    newsContainer.innerHTML = "<p>Searching...</p>";
    try {
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&apikey=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        displayNews(data.articles);
    } catch (error) {
        newsContainer.innerHTML = "<p>Search failed 😢</p>";
    }
}

// Display news cards
function displayNews(articles) {
    newsContainer.innerHTML = "";
    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = "<p>No news found</p>";
        return;
    }
    articles.forEach(article => {
        const card = document.createElement("div");
        card.classList.add("news-card");
        card.innerHTML = `
            <img src="${article.image || 'https://via.placeholder.com/300'}" alt="News Image">
            <div class="content">
                <h3>${article.title}</h3>
                <p>${article.description || "No description available."}</p>
            </div>
        `;
        card.addEventListener("click", () => {
            window.open(article.url, "_blank");
        });
        newsContainer.appendChild(card);
    });
}

// Event listeners
categoryLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        categoryLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        fetchNews(link.dataset.category);
    });
});

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) searchNews(query);
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) searchNews(query);
    }
});

// Initial load
fetchNews();
function showSkeleton(count = 6) {
    newsContainer.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const skeletonCard = document.createElement("div");
        skeletonCard.classList.add("news-card");
        skeletonCard.innerHTML = `
            <div class="skeleton skeleton-img"></div>
            <div class="content">
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text" style="width:80%"></div>
            </div>
        `;
        newsContainer.appendChild(skeletonCard);
    }
}
// Scroll-hide navbar
let prevScroll = window.scrollY;
const navbar = document.querySelector("nav");

window.addEventListener("scroll", () => {
  let currentScroll = window.scrollY;
  if (currentScroll > prevScroll && currentScroll > 60) {
    navbar.style.top = "-100px"; // Hide navbar
  } else {
    navbar.style.top = "0"; // Show navbar
  }
  prevScroll = currentScroll;
});
