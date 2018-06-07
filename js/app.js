const CARDS_CONTAINER = document.querySelector(".deck");

const ICONS = [
  "fa fa-diamond",
  "fa fa-paper-plane-o",
  "fa fa-anchor",
  "fa fa-bolt",
  "fa fa-cube",
  "fa fa-leaf",
  "fa fa-bicycle",
  "fa fa-bomb"
];

function iconOfCard(card) {
  return card.children[0].getAttribute("class");
}

function cardsMatch(one, two) {
  return iconOfCard(one) === iconOfCard(two);
}

function reveal(...cards) {
  cards.forEach(card => card.classList.add("reveal", "open"));
}

function match(...cards) {
  cards.forEach(card => card.classList.add("match"));
}

function hide(...cards) {
    cards.forEach(card => card.classList.remove("reveal", "open"));
}

function gameIsOver() {
    return Array.from(CARDS_CONTAINER.children)
                .filter(e => e.tagName === "LI")
                .every(c => c.classList.contains("match"));
}

function endGame() {
    alert("You won!");
}

function addNewCard(icon) {
    let card = document.createElement("li");
    card.classList.add("card");
    card.innerHTML = `<i class="${icon}"></i>`;
    CARDS_CONTAINER.appendChild(card);
    return card;
}

let revealedCard;

for (let j = 0; j < 2; j++) {
  for (let i = 0; i < ICONS.length; i++) {

    let card = addNewCard(ICONS[i]);

    card.addEventListener("click", () => {
      if (revealedCard === card) {
        return;
      }

      reveal(card);
      
      if (revealedCard !== undefined) {
        if (cardsMatch(revealedCard, card)) {
            match(card, revealedCard);
        } else {
            hide(card, revealedCard);
        }
        revealedCard = undefined;
      } else {
        revealedCard = card;
      }
      
      if (gameIsOver()) {
          setTimeout(endGame, 1);
      }

    });
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