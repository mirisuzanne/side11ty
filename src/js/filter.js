export default function filter() {
  sessionStorage.removeItem('filter');

  const cardList = document.querySelector("[data-cards]");
  const cards = document.querySelectorAll("[data-tags]");
  const tagBtns = document.querySelectorAll("[data-tag]");

  const toArray = (string, delim) => string ? string.split(delim).filter(item => item) : [];
  const getFilters = () => toArray(sessionStorage.getItem('filter'), ',');
  const storeFilters = (to) => sessionStorage.setItem('filter', to);

  const btnPress = (filters) => {
    tagBtns.forEach(btn => {
      const tag = btn.getAttribute('data-tag');
      const toState = filters.includes(tag) ? 'true' : 'false';
      btn.setAttribute('aria-pressed', toState);
    });
  }

  const filterCards = (filters) => {
    cards.forEach(card => {
      if (filters.length) {
        const cardTags = toArray(card.getAttribute('data-tags'), ' ');
        const showCard = filters.every(tag => cardTags.includes(tag));

        if (showCard) {
          card.removeAttribute('hidden');
        } else {
          card.setAttribute('hidden', '');
        }
      } else {
        card.removeAttribute('hidden');
      }
    });
  };

  const doFilters = (btn) => {
    if (btn && btn.matches("[data-tag]")) {
      const tag = btn.getAttribute("data-tag");
      let filters = getFilters();

      if (filters.includes(tag)) {
        filters = filters.filter((item) => item !== tag);
      } else {
        filters.push(tag);
      }

      btnPress(filters);
      filterCards(filters);
      storeFilters(filters);
    }
  }

  if (cardList) {
    cardList.addEventListener("click", (e) => doFilters(e.target));
  }
}
