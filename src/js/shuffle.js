export default function shuffle() {
  const ShuffleBtn = document.querySelector('[data-btn="shuffle"]');

  const shuffleCards = () => {
    let cards = document.querySelector('[data-cards]'); // get the list
    let temp = cards.cloneNode(true); // clone the list
    let i = temp.children.length + 1;

    // shuffle the cloned list (better performance)
    while ( i-- > 0 ) {
      temp.appendChild( temp.children[Math.random() * i |0] );
    }

    cards.parentNode.replaceChild(temp, cards); // copy shuffled back to list
  }

  if (ShuffleBtn) {
    ShuffleBtn.addEventListener('click', () => {
      shuffleCards();
    });
  }
}
