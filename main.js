/**
 * main.js
 * Lógica interactiva de la documentación DSI-NET.
 * Módulos:
 *   1. Sidebar toggle (mostrar/ocultar TOC en escritorio y móvil)
 *   2. Acordeón de la tabla de contenidos (grupos colapsables)
 *   3. Filtro en tiempo real del árbol de contenidos
 *   4. Selector de idioma (ES / PE)
 *   5. Atajo de teclado Ctrl+K para enfocar el buscador
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. SIDEBAR TOGGLE
     ============================================================ */
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');

  const isMobile = () => window.matchMedia('(max-width: 900px)').matches;

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      if (isMobile()) {
        // En móvil el sidebar se desliza como panel superpuesto
        const isOpen = sidebar.classList.toggle('is-open');
        sidebarToggle.setAttribute('aria-expanded', String(isOpen));
      } else {
        // En escritorio el sidebar se colapsa/expande en el layout
        const isCollapsed = sidebar.classList.toggle('is-collapsed');
        sidebarToggle.setAttribute('aria-expanded', String(!isCollapsed));
      }
    });

    // Cierra el sidebar móvil al hacer click en un enlace del TOC
    sidebar.addEventListener('click', (event) => {
      if (isMobile() && event.target.classList.contains('toc__link')) {
        sidebar.classList.remove('is-open');
        sidebarToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     2. ACORDEÓN DE LA TABLA DE CONTENIDOS
     ============================================================ */
  const tocList = document.getElementById('tocList');

  if (tocList) {
    tocList.addEventListener('click', (event) => {
      const toggleBtn = event.target.closest('.toc__toggle');
      if (!toggleBtn) return;

      const groupItem = toggleBtn.closest('.toc__item--group');
      if (groupItem) {
        const isOpen = groupItem.classList.toggle('is-open');
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
      }
    });
  }

  /* ============================================================
     3. FILTRO EN TIEMPO REAL DEL ÁRBOL DE CONTENIDOS
     ============================================================ */
  const tocFilter = document.getElementById('tocFilter');

  if (tocFilter && tocList) {
    const allTocItems = Array.from(tocList.querySelectorAll('li'));

    tocFilter.addEventListener('input', () => {
      const query = tocFilter.value.trim().toLowerCase();

      if (query === '') {
        // Restaura la visibilidad original de todos los ítems
        allTocItems.forEach((item) => item.classList.remove('is-hidden'));
        return;
      }

      allTocItems.forEach((item) => {
        const link = item.querySelector(':scope > a.toc__link, :scope > button.toc__toggle');
        const label = link ? link.textContent.toLowerCase() : '';
        const matchesSelf = label.includes(query);

        // Un ítem coincide si su propio texto coincide o si algún descendiente coincide
        const descendantMatches = Array.from(item.querySelectorAll('a.toc__link'))
          .some((a) => a.textContent.toLowerCase().includes(query));

        const isMatch = matchesSelf || descendantMatches;
        item.classList.toggle('is-hidden', !isMatch);

        // NOTA: Se removió la apertura automática de acordeones para que permanezcan cerrados
      });
    });
  }

  /* ============================================================
     4. SELECTOR DE IDIOMA (ES / PE)
     ============================================================ */
  const langToggle = document.getElementById('langToggle');

  if (langToggle) {
    langToggle.addEventListener('click', (event) => {
      const btn = event.target.closest('.topbar__lang-btn');
      if (!btn) return;

      langToggle.querySelectorAll('.topbar__lang-btn').forEach((b) => {
        b.classList.toggle('is-active', b === btn);
      });
    });
  }

  /* ============================================================
     5. ATAJO DE TECLADO Ctrl+K PARA EL BUSCADOR
     ============================================================ */
  const topSearch = document.getElementById('topSearch');

  if (topSearch) {
    document.addEventListener('keydown', (event) => {
      const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
      if (isShortcut) {
        event.preventDefault();
        topSearch.focus();
      }
      // Escape libera el foco del buscador
      if (event.key === 'Escape' && document.activeElement === topSearch) {
        topSearch.blur();
      }
    });
  }

});