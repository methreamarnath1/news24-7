function reload() {
    window.location.reload();
}

const API_key = "5f72f34a9b13435f94b5d7d566394a18";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener('load', () => fetchNews("india"));

async function fetchNews(query) {
    const loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.style.display = 'block';

    try {
        const res = await fetch(`${url}${query}&apiKey=${API_key}`);
        if (!res.ok) {
            throw new Error('Network response was not ok ' + res.statusText);
        }
        const data = await res.json();
        bindData(data.articles);
    } catch (error) {
        console.error("Fetch error: ", error);
        showError("Failed to load news. Please try again later.");
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById('card-container');
    const newsCardTemplate = document.getElementById('template-news-card');

    cardsContainer.innerHTML = '';
    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-us", { timeZone: "Asia/jakarta" });
    newsSource.innerHTML = `${article.source.name} . ${date}`;
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = navItem;
    curSelectedNav.classList.add('active');
}

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');

searchButton.addEventListener('click', () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

function showError(message) {
    const cardsContainer = document.getElementById('card-container');
    cardsContainer.innerHTML = `<p class="error-message">${message}</p>`;
}

let curSelectedNav = null;
