const container = document.getElementById("news-container");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("search");
const resultCount = document.getElementById("result-count");

let allArticles = [];

showSkeletonCards(6);

fetch("https://hn.algolia.com/api/v1/search?query=cybersecurity")
  .then((response) => response.json())
  .then((data) => {
    loading.style.display = "none";
    allArticles = data.hits || [];
    displayArticles(allArticles);
  })
  .catch(() => {
    container.innerHTML = "";
    loading.textContent = "Could not load stories right now. Please refresh.";
    resultCount.textContent = "0 results";
  });

function showSkeletonCards(count) {
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton";
    skeleton.innerHTML = `
      <div class="skeleton-line long"></div>
      <div class="skeleton-line medium"></div>
      <div class="skeleton-line short"></div>
    `;
    container.appendChild(skeleton);
  }
}

function getArticleTitle(article) {
  return article.title || article.story_title || "Untitled Story";
}

function getArticleUrl(article) {
  if (article.url) {
    return article.url;
  }

  return "https://news.ycombinator.com/item?id=" + article.objectID;
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch (error) {
    return "news.ycombinator.com";
  }
}

function formatDate(dateString) {
  if (!dateString) {
    return "Date unknown";
  }

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function updateResultCount(count) {
  const label = count === 1 ? "result" : "results";
  resultCount.textContent = count + " " + label;
}

function displayArticles(articles) {
  container.innerHTML = "";
  updateResultCount(articles.length);

  if (articles.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No matching stories found. Try a broader keyword.";
    container.appendChild(empty);
    return;
  }

  articles.forEach((article) => {
    const card = document.createElement("div");
    card.className = "card";

    const titleText = getArticleTitle(article);
    const articleUrl = getArticleUrl(article);

    const title = document.createElement("h3");
    title.textContent = titleText;

    const metadata = document.createElement("p");
    metadata.className = "meta";
    metadata.textContent =
      "By " +
      (article.author || "Unknown") +
      " | " +
      formatDate(article.created_at) +
      " | " +
      getDomain(articleUrl);

    const link = document.createElement("a");
    link.href = articleUrl;
    link.className = "read-link";
    link.textContent = "Read Story";
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    card.appendChild(title);
    card.appendChild(metadata);
    card.appendChild(link);

    container.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase().trim();

  const filtered = allArticles.filter((article) => {
    const title = getArticleTitle(article).toLowerCase();
    return title.includes(value);
  });

  displayArticles(filtered);
});