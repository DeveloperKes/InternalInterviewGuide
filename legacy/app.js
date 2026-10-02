(() => {
  const STORAGE_DATA = "interviewGuide.customData.v1";
  const STORAGE_FAVORITES = "interviewGuide.favorites.v1";
  const STORAGE_THEME = "interviewGuide.theme.v1";

  const els = {
    search: document.querySelector("#search"),
    category: document.querySelector("#categoryFilter"),
    priority: document.querySelector("#priorityFilter"),
    type: document.querySelector("#typeFilter"),
    favoritesOnly: document.querySelector("#favoritesOnly"),
    clearFilters: document.querySelector("#clearFilters"),
    cards: document.querySelector("#cards"),
    empty: document.querySelector("#emptyState"),
    resultCount: document.querySelector("#resultCount"),
    dataSource: document.querySelector("#dataSource"),
    stats: document.querySelector("#stats"),
    jsonFile: document.querySelector("#jsonFile"),
    exportJson: document.querySelector("#exportJson"),
    restoreDefault: document.querySelector("#restoreDefault"),
    randomHigh: document.querySelector("#randomHigh"),
    randomCard: document.querySelector("#randomCard"),
    expandAll: document.querySelector("#expandAll"),
    errorDialog: document.querySelector("#errorDialog"),
    errorMessage: document.querySelector("#errorMessage"),
    themeToggle: document.querySelector("#themeToggle")
  };

  const fallback = window.INTERVIEW_GUIDE_DEFAULT_DATA || { meta: {}, items: [] };
  let data = loadStoredData() || structuredCloneSafe(fallback);
  let favorites = loadFavorites();
  let expandedCards = new Set();
  let allExpanded = false;

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_THEME);
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_THEME, next);
  }

  function structuredCloneSafe(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadStoredData() {
    try {
      const raw = localStorage.getItem(STORAGE_DATA);
      return raw ? validateData(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  }

  function loadFavorites() {
    try {
      const raw = localStorage.getItem(STORAGE_FAVORITES);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  }

  function saveFavorites() {
    localStorage.setItem(STORAGE_FAVORITES, JSON.stringify([...favorites]));
  }

  function saveData(customData) {
    localStorage.setItem(STORAGE_DATA, JSON.stringify(customData));
  }

  function validateData(candidate) {
    if (!candidate || typeof candidate !== "object") {
      throw new Error("El archivo debe contener un objeto JSON.");
    }
    if (!Array.isArray(candidate.items)) {
      throw new Error("El JSON debe tener una propiedad 'items' de tipo arreglo.");
    }

    const seen = new Set();
    candidate.items.forEach((item, index) => {
      if (!item || typeof item !== "object") {
        throw new Error(`El elemento ${index + 1} no es válido.`);
      }
      const required = ["id", "category", "priority", "question"];
      required.forEach(key => {
        if (!item[key] || typeof item[key] !== "string") {
          throw new Error(`El elemento ${index + 1} necesita '${key}' como texto.`);
        }
      });
      if (seen.has(item.id)) throw new Error(`ID duplicado: ${item.id}`);
      seen.add(item.id);

      item.type = item.type || "pregunta";
      item.expected = item.expected || "";
      item.basic = item.basic || "";
      item.followups = Array.isArray(item.followups) ? item.followups : [];
      item.terms = Array.isArray(item.terms) ? item.terms : [];
      item.tags = Array.isArray(item.tags) ? item.tags : [];
    });

    candidate.meta = candidate.meta || {};
    return candidate;
  }

  function showError(message) {
    els.errorMessage.textContent = message;
    if (typeof els.errorDialog.showModal === "function") {
      els.errorDialog.showModal();
    } else {
      alert(message);
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function normalize(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function rebuildCategories() {
    const categories = [...new Set(data.items.map(item => item.category))].sort((a,b) => a.localeCompare(b, "es"));
    const current = els.category.value || "all";
    els.category.innerHTML =
      `<option value="all">Todas</option>` +
      categories.map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("");

    if ([...els.category.options].some(option => option.value === current)) {
      els.category.value = current;
    }
  }

  function getFilteredItems() {
    const term = normalize(els.search.value.trim());
    return data.items.filter(item => {
      const searchText = normalize([
        item.question,
        item.category,
        item.priority,
        item.type,
        item.expected,
        item.basic,
        ...(item.followups || []).flatMap(x => typeof x === "object" && x !== null ? [x.q || x.question, x.a || x.answer] : [x]),
        ...(item.tags || []),
        ...(item.terms || []).flatMap(t => [t.term, t.definition])
      ].join(" "));

      const matchesSearch = !term || searchText.includes(term);
      const matchesCategory = els.category.value === "all" || item.category === els.category.value;
      const matchesPriority = els.priority.value === "all" || item.priority === els.priority.value;
      const matchesType = els.type.value === "all" || item.type === els.type.value;
      const matchesFavorite = !els.favoritesOnly.checked || favorites.has(item.id);

      return matchesSearch && matchesCategory && matchesPriority && matchesType && matchesFavorite;
    });
  }

  function priorityBadge(priority) {
    if (priority === "alta") return `<span class="badge high"><span class="dot"></span>Alta</span>`;
    if (priority === "media") return `<span class="badge medium"><span class="dot"></span>Media</span>`;
    return `<span class="badge complementaria"><span class="dot"></span>Complementaria</span>`;
  }

  function renderCard(item) {
    const isFavorite = favorites.has(item.id);
    const isConcept = item.type === "concepto";
    const conceptBadge = isConcept ? `<span class="badge concept"><span class="dot"></span>Concepto</span>` : "";
    const isExpanded = allExpanded || expandedCards.has(item.id);

    const titleExpected = isConcept ? "Explicación del concepto" : "Qué quieres escuchar";
    const titleBasic = isConcept ? "Malentendido o error común" : "Respuesta demasiado básica";
    const titleFollowups = isConcept ? "Puntos clave a profundizar" : "Repreguntas naturales";
    const titleTerms = isConcept ? "Términos y definiciones" : "Tecnicismos";

    const followups = item.followups.length
      ? `<ul class="detail-list">${item.followups.map(x => {
          if (typeof x === "object" && x !== null) {
            const q = x.q || x.question || "";
            const a = x.a || x.answer || "";
            return `<li><strong class="followup-q">${escapeHtml(q)}</strong>${a ? `<p class="followup-a">${escapeHtml(a)}</p>` : ""}</li>`;
          }
          return `<li>${escapeHtml(x)}</li>`;
        }).join("")}</ul>`
      : `<p class="muted">${isConcept ? "No hay puntos adicionales registrados." : "No hay repreguntas registradas."}</p>`;

    const terms = item.terms.length
      ? `<div class="terms-grid">${item.terms.map(t => `<div class="term-card"><strong class="term-title">${escapeHtml(t.term)}</strong><span class="term-def">${escapeHtml(t.definition)}</span></div>`).join("")}</div>`
      : `<p class="muted">No hay tecnicismos registrados.</p>`;

    const tags = item.tags.length
      ? `<div class="tags">${item.tags.map(tag => `<span class="tag">#${escapeHtml(tag)}</span>`).join("")}</div>`
      : "";

    return `
      <article class="card ${isExpanded ? "expanded" : ""}" data-id="${escapeHtml(item.id)}">
        <div class="card-summary">
          <div class="card-main-info">
            <div class="badges">
              <span class="badge category-badge">${escapeHtml(item.category)}</span>
              ${priorityBadge(item.priority)}
              ${conceptBadge}
            </div>
            <h2 class="card-title">${escapeHtml(item.question)}</h2>
            ${tags}
          </div>

          <div class="card-actions">
            <button class="icon-btn ${isFavorite ? "favorite" : ""}" data-action="favorite" type="button"
              title="${isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}"
              aria-label="${isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="${isFavorite ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
            <button class="toggle-btn" data-action="toggle" type="button" aria-expanded="${isExpanded}">
              <span>${isExpanded ? "Ocultar" : "Ver guía"}</span>
              <svg class="chevron-icon ${isExpanded ? "rotated" : ""}" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <div class="card-details ${isExpanded ? "" : "hidden"}">
          <div class="detail-grid">
            <section class="detail-block expected-block">
              <h3>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                ${titleExpected}
              </h3>
              <p>${escapeHtml(item.expected || "Sin explicación registrada.")}</p>
            </section>

            <section class="detail-block basic-block">
              <h3>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                ${titleBasic}
              </h3>
              <p>${escapeHtml(item.basic || "Sin registro.")}</p>
            </section>

            <section class="detail-block followups-block">
              <h3>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                ${titleFollowups}
              </h3>
              ${followups}
            </section>

            <section class="detail-block terms-block">
              <h3>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                ${titleTerms}
              </h3>
              ${terms}
            </section>
          </div>
        </div>
      </article>
    `;
  }

  function render() {
    const items = getFilteredItems();
    els.cards.innerHTML = items.map(renderCard).join("");
    els.empty.classList.toggle("hidden", items.length > 0);
    els.resultCount.textContent = `${items.length} resultado${items.length === 1 ? "" : "s"}`;
    els.dataSource.textContent = localStorage.getItem(STORAGE_DATA) ? "· Base personalizada cargada" : "· Base incluida";

    const total = data.items.length;
    const high = data.items.filter(x => x.priority === "alta").length;
    const categories = new Set(data.items.map(x => x.category)).size;
    const favs = favorites.size;

    els.stats.innerHTML = `
      <div class="stats-grid">
        <div class="stat"><strong>${total}</strong><span>Elementos</span></div>
        <div class="stat"><strong>${high}</strong><span>Alta prioridad</span></div>
        <div class="stat"><strong>${categories}</strong><span>Categorías</span></div>
        <div class="stat"><strong>${favs}</strong><span>Favoritos</span></div>
      </div>
    `;
  }

  function clearFilters() {
    els.search.value = "";
    els.category.value = "all";
    els.priority.value = "all";
    els.type.value = "all";
    els.favoritesOnly.checked = false;
    els.randomCard.classList.add("hidden");
    render();
  }

  function toggleCard(article, button) {
    const id = article.dataset.id;
    const details = article.querySelector(".card-details");
    const chevron = button.querySelector(".chevron-icon");
    const span = button.querySelector("span");
    const isOpen = !details.classList.contains("hidden");

    if (isOpen) {
      details.classList.add("hidden");
      article.classList.remove("expanded");
      if (chevron) chevron.classList.remove("rotated");
      if (span) span.textContent = "Ver guía";
      button.setAttribute("aria-expanded", "false");
      expandedCards.delete(id);
    } else {
      details.classList.remove("hidden");
      article.classList.add("expanded");
      if (chevron) chevron.classList.add("rotated");
      if (span) span.textContent = "Ocultar";
      button.setAttribute("aria-expanded", "true");
      expandedCards.add(id);
    }
  }

  function toggleFavorite(id, button) {
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    saveFavorites();
    render();
  }

  function chooseRandomHigh() {
    const visible = getFilteredItems();
    let pool = visible.filter(item => item.priority === "alta" && item.type === "pregunta");
    if (!pool.length) pool = data.items.filter(item => item.priority === "alta" && item.type === "pregunta");
    if (!pool.length) return;

    const item = pool[Math.floor(Math.random() * pool.length)];
    let followText = "";
    if (item.followups?.[0]) {
      const f = item.followups[0];
      const q = typeof f === "object" ? (f.q || f.question) : f;
      const a = typeof f === "object" ? (f.a || f.answer) : "";
      followText = `<br><span class="muted">Repregunta: ${escapeHtml(q)}</span>${a ? `<br><span class="small muted">Respuesta esperada: ${escapeHtml(a)}</span>` : ""}`;
    }
    els.randomCard.innerHTML = `
      <h2>Pregunta Senior sugerida · ${escapeHtml(item.category)}</h2>
      <p><strong>${escapeHtml(item.question)}</strong>${followText}</p>
    `;
    els.randomCard.classList.remove("hidden");
    els.randomCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  async function importJson(file) {
    try {
      const text = await file.text();
      const parsed = validateData(JSON.parse(text));
      data = parsed;
      saveData(data);
      rebuildCategories();
      clearFilters();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Archivo JSON inválido.");
    } finally {
      els.jsonFile.value = "";
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "temario-entrevista.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function restoreDefault() {
    localStorage.removeItem(STORAGE_DATA);
    data = structuredCloneSafe(fallback);
    rebuildCategories();
    clearFilters();
  }

  els.search.addEventListener("input", render);
  els.category.addEventListener("change", render);
  els.priority.addEventListener("change", render);
  els.type.addEventListener("change", render);
  els.favoritesOnly.addEventListener("change", render);
  els.clearFilters.addEventListener("click", clearFilters);
  els.randomHigh.addEventListener("click", chooseRandomHigh);
  els.jsonFile.addEventListener("change", () => {
    const file = els.jsonFile.files?.[0];
    if (file) importJson(file);
  });
  els.exportJson.addEventListener("click", exportJson);
  els.restoreDefault.addEventListener("click", restoreDefault);

  if (els.themeToggle) {
    els.themeToggle.addEventListener("click", toggleTheme);
  }

  els.expandAll.addEventListener("click", () => {
    allExpanded = !allExpanded;
    if (allExpanded) {
      data.items.forEach(x => expandedCards.add(x.id));
    } else {
      expandedCards.clear();
    }
    const span = els.expandAll.querySelector("span");
    if (span) span.textContent = allExpanded ? "Contraer todo" : "Expandir todo";
    render();
  });

  els.cards.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const article = button.closest(".card");
    if (!article) return;

    if (button.dataset.action === "toggle") toggleCard(article, button);
    if (button.dataset.action === "favorite") toggleFavorite(article.dataset.id, button);
  });

  initTheme();
  rebuildCategories();
  render();
})();
