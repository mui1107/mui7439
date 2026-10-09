/* ============================================================
   創作區分類頁（gallery-tui.html / gallery-oc.html）的渲染邏輯
   一般不需要修改這個檔案，改內容請到 data.js
   每個分類頁在載入這個檔案之前，會先用一行小程式設定
   PAGE_TAG（例如 "推" 或 "oc"），決定要顯示哪些圖片。
   ============================================================ */

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

/* ---------- 整體介紹文字 ---------- */
function renderIntro(text) {
  const wrap = document.getElementById("category-intro");
  if (!text) {
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;
  wrap.textContent = text;
}

/* ---------- 圖片一覽（只顯示這個分類的圖，沒有篩選鈕） ---------- */
function renderGallery(items, tag) {
  const grid = document.getElementById("gallery-grid");
  const shown = (items || []).filter(i => i.tag === tag);

  if (!shown.length) {
    grid.appendChild(el("div", "gallery-empty", "還沒有圖片"));
    return;
  }

  shown.forEach(item => {
    const card = el("div", "gallery-item");
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" loading="lazy" />
      <div class="gallery-caption">
        <span class="g-title">${item.title}</span>
      </div>`;
    card.addEventListener("click", () => openLightbox(item.image, item.title, item.tag, item.desc, item.artist, item.artistUrl));
    grid.appendChild(card);
  });
}

/* ---------- Lightbox（點進去才看到說明） ---------- */
function openLightbox(src, title, tag, desc, artist, artistUrl) {
  const box = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");
  img.src = src;
  img.alt = title || "";

  const hasTitle = !!title;
  const hasTag = !!tag;
  const hasDesc = !!desc;
  const hasArtist = !!artist;

  if (hasTitle || hasTag || hasDesc || hasArtist) {
    caption.hidden = false;
    caption.innerHTML = `
      ${hasTitle || hasTag ? `
        <div class="lightbox-caption-head">
          ${hasTitle ? `<span class="lightbox-caption-title">${title}</span>` : ""}
          ${hasTag ? `<span class="lightbox-caption-tag">${tag}</span>` : ""}
        </div>` : ""}
      ${hasDesc ? `<p class="lightbox-caption-desc">${desc}</p>` : ""}
      ${hasArtist ? `<p class="lightbox-caption-artist">繪師：${artistUrl ? `<a href="${artistUrl}" target="_blank" rel="noopener noreferrer">${artist}</a>` : artist}</p>` : ""}
    `;
  } else {
    caption.hidden = true;
    caption.innerHTML = "";
  }

  box.hidden = false;
}
function closeLightbox() {
  document.getElementById("lightbox").hidden = true;
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const tag = window.PAGE_TAG;
  renderIntro(SITE_DATA.galleryIntro ? SITE_DATA.galleryIntro[tag] : "");
  renderGallery(SITE_DATA.gallery, tag);

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
});
