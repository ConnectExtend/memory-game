const CARDS_CONTAINER = document.querySelector(".deck");
const RESTART_BUTTON = document.querySelector(".restart");
const ATTEMPT_TEXT = document.querySelector(".attemptText");
const ATTEMPT_COUNTER = document.querySelector(".attemptCounter");

const ICONS = [
  "fab fa-bitcoin",
  "fas fa-euro-sign",
  "fas fa-dollar-sign",
  "fab fa-ethereum",
  "fas fa-yen-sign",
  "fas fa-ruble-sign",
  "fas fa-pound-sign",
  "fas fa-shekel-sign"
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

function isMatched(card) {
  return card != undefined && card.classList.contains("match");
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

function resetBoard() {
  Array.from(CARDS_CONTAINER.children)
        .forEach(child => CARDS_CONTAINER.removeChild(child));
}

function setAttempts(number) {
    ATTEMPT_COUNTER.textContent = number;
    if (number > 1 || number < 0) {
        ATTEMPT_TEXT.textContent = "Attempts";
    } else {
        ATTEMPT_TEXT.textContent = "Attempt";
    }
}

function getAttempts() {
    return parseInt(ATTEMPT_COUNTER.textContent);
}

function startGame() {
  let revealedCard;

  for (let j = 0; j < 2; j++) {
    let shuffledIcons = ICONS.sort(i => Math.random() < 0.7);
    for (let i = 0; i < shuffledIcons.length; i++) {
      let card = addNewCard(shuffledIcons[i]);

      card.addEventListener("click", () => {
        if (revealedCard === card || isMatched(card)) {
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
          setAttempts((getAttempts() || 0) + 1);
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
}

RESTART_BUTTON.addEventListener("click", () => {
    resetBoard();
    startGame();
});

startGame();