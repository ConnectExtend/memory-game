/*
 * create an array of the icons (2 of each) and a list that holds all of the cards
 */
const icons = [
  "fab fa-git",
  "fab fa-windows",
  "fab fa-apple",
  "fab fa-google",
  "fab fa-css3-alt",
  "fab fa-slack",
  "fab fa-js",
  "fab fa-html5",
  "fab fa-git",
  "fab fa-windows",
  "fab fa-apple",
  "fab fa-google",
  "fab fa-css3-alt",
  "fab fa-slack",
  "fab fa-js",
  "fab fa-html5"
];

const cardsContainer = document.querySelector(".deck");

let openedCards = [];
let matchedCards = [];

// create the cards
for (let i = 0; i < icons.length; i++) {
  const card = document.createElement("li");
  card.classList.add("card");
  card.innerHTML = `<i class="${icons[i]}"></i>`;
  cardsContainer.appendChild(card);

  card.addEventListener("click", function() {
    const currentCard = this;
    const previousCard = openedCards[0];

    if (openedCards.length === 1) {
      card.classList.add("open", "show");
      openedCards.push(this);

      if (currentCard.innerHTML === previousCard.innerHTML) {
        currentCard.classList.add("match");
        previousCard.classList.add("match");

        matchedCards.push(currentCard, previousCard);
        openedCards = [];

        gameOver();
      } else {
        currentCard.classList.remove("open", "show");
        previousCard.classList.remove("open", "show");

        openedCards = [];
      }
    } else {
      card.classList.add("open", "show");
      openedCards.push(this);
    }
  });
}

function gameOver() {
  if (matchedCards.length === icons.length) {
    alert("Game over!");
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
