const container = document.getElementById("news-container");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("search");

let allArticles = [];

fetch("https://hn.algolia.com/api/v1/search?query=cybersecurity")
  .then(response => response.json())
  .then(data => {
    loading.style.display = "none";

    allArticles = data.hits;
    displayArticles(allArticles);
  });

function displayArticles(articles) {
  container.innerHTML = "";

  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = article.title || "No Title";

    const author = document.createElement("p");
    author.textContent = "By " + article.author;

    const link = document.createElement("a");
    link.href = article.url || "#";
    link.textContent = "Read More";
    link.target = "_blank";

    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(link);

    container.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = allArticles.filter(article =>
    article.title && article.title.toLowerCase().includes(value)
  );

  displayArticles(filtered);
});