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
  let shuffledIcons = ICONS.sort(i => Math.random() < 0.5);
  for (let i = 0; i < shuffledIcons.length; i++) {
    let card = addNewCard(shuffledIcons[i]);

    card.addEventListener("click", () => {
      if (revealedCard === card) {
        return;
      }

      reveal(card);

      if (revealedCard !== undefined) {
        if (cardsMatch(revealedCard, card)) {
          match(card, revealedCard);
        } else {
          let cardToHide = revealedCard;
          setTimeout(
            () =>
              CARDS_CONTAINER.addEventListener(
                "click",
                (hider = function(e) {
                  if (cardToHide !== e.target) {
                    hide(cardToHide);
                  }

                  if (card !== e.target) {
                    hide(card);
                  }
                  CARDS_CONTAINER.removeEventListener("click", hider);
                })
              ),
            1
          );
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
