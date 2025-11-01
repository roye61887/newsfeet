const NEWS_API_KEY = "28420ec1b38d4a59affe75152dae74d2";
const country = "in";
const categoryDefault = "";

$(function () {
  const $newsGrid = $("#newsGrid");
  const $loader = $("#loader");
  const $errorBox = $("#errorBox");
  let category = categoryDefault;
  let query = "";

  loadNews();

  $(".category-btn").click(function () {
    $(".category-btn").removeClass("active");
    $(this).addClass("active");
    category = $(this).data("category");
    query = "";
    loadNews();
  });

  $("#searchBtn").click(() => {
    query = $("#searchInput").val().trim();
    loadNews();
  });

  function loadNews() {
    $loader.removeClass("d-none");
    $errorBox.addClass("d-none");
    $newsGrid.html("");

    if (NEWS_API_KEY && NEWS_API_KEY.trim() !== "") {
      const apiUrl = query
        ? `https://newsapi.org/v2/everything?q=${query}&apiKey=${NEWS_API_KEY}`
        : `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${NEWS_API_KEY}`;

      fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
          if (data.status === "ok") renderArticles(data.articles);
          else showError("API Error: " + data.message);
        })
        .catch(() => {
          showError("ইন্টারনেট সংযোগ নেই বা API সমস্যা!");
          renderArticles(demoNews);
        })
        .finally(() => $loader.addClass("d-none"));
    } else {
      renderArticles(demoNews);
      $loader.addClass("d-none");
    }
  }

  function renderArticles(articles) {
    if (!articles || articles.length === 0) {
      $newsGrid.html(`<div class='col-12 text-center'><p class='text-muted'>কোনো নিউজ পাওয়া যায়নি 😞</p></div>`);
      return;
    }
    const cards = articles.map(a => {
      const img = a.urlToImage || "https://via.placeholder.com/400x200?text=No+Image";
      const title = a.title || "Untitled";
      const desc = a.description || "";
      const source = a.source?.name || "Unknown";
      const url = a.url || "#";
      return `<div class="col-sm-6 col-lg-4"><div class="card card-news shadow-sm h-100">
        <img src="${img}" class="card-img-top" alt="News Image">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${title}</h5>
          <p class="card-text small text-muted">${desc}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <small class="text-muted">${source}</small>
            <a href="${url}" target="_blank" class="btn btn-sm btn-outline-primary">Read</a>
          </div>
        </div></div></div>`;
    }).join("");
    $newsGrid.html(cards);
  }
  function showError(msg) {
    $errorBox.text(msg).removeClass("d-none");
  }
});

const demoNews = [
  { title: "ভারতের অর্থনীতি দ্রুত বৃদ্ধি পাচ্ছে", description: "ভারতের জিডিপি ২০২৫ সালে নতুন রেকর্ড স্পর্শ করেছে।", urlToImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400", url: "https://example.com/news1", source: { name: "BBC Hindi" } },
  { title: "টেকনোলজির নতুন যুগ শুরু", description: "AI এবং মেশিন লার্নিংয়ের ব্যবহার বৃদ্ধি পাচ্ছে সব ক্ষেত্রে।", urlToImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400", url: "https://example.com/news2", source: { name: "TechCrunch" } },
  { title: "বাংলাদেশে বন্যা পরিস্থিতি উন্নতির পথে", description: "পানি কমতে শুরু করেছে, মানুষ ঘরে ফিরছে।", urlToImage: "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=400", url: "https://example.com/news3", source: { name: "The Daily Star" } },
  { title: "বিশ্বকাপে ভারতের দুর্দান্ত জয়", description: "ভারত ৫ উইকেটে পাকিস্তানকে পরাজিত করেছে।", urlToImage: "https://images.unsplash.com/photo-1505842465776-3b4953ca4f83?w=400", url: "https://example.com/news4", source: { name: "ESPN" } }
];