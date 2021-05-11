export default function shuffle() {
  const ShuffleBtn = document.querySelector('[data-btn="shuffle"]');

  const shuffleCards = () => {
    const list = document.querySelector("[data-cards]");
    for (let i = list.children.length; i > 0; i--) {
      // if you append a node it will move even if it's still in the DOM which is rad
      list.append(list.children[Math.random() * i | 0]);
    }
  };

  if (ShuffleBtn) {
    ShuffleBtn.addEventListener('click', () => {
      shuffleCards();
    });
  }
}
