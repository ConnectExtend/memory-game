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

// create the cards
for (let i = 0; i < icons.length; i++) {
  const card = document.createElement("li");
  card.classList.add("card");
  card.innerHTML = `<i class="${icons[i]}"></i>`;
  cardsContainer.appendChild(card);

  card.addEventListener("click", function() {
    if (openedCards.length === 1) {
      card.classList.add("open", "show");
      openedCards.push(this);

        if (this.innerHTML === openedCards[0].innerHTML) {
            console.log("matched!");
        } else {
            console.log("NOT matched!");
        }
    
    } else {
      card.classList.add("open", "show");
      openedCards.push(this);
    }
  });
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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
