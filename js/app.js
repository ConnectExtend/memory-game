const CARDS_CONTAINER = document.querySelector(".deck");
const RESTART_BUTTON = document.querySelector(".restart");
const ATTEMPT_TEXT = document.querySelector(".attemptText");
const ATTEMPT_COUNTER = document.querySelector(".attemptCounter");
const STARS_CONTAINER = document.querySelector(".stars");
const TIMER = document.querySelector(".timer");

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

let timerTask;

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

function padNumber(number) {
  return number.toString().length == 1 ? "0" + number : number.toString();
}

function getFormattedTime() {
  let elapsed = getElapsedSeconds();
  let minutes = Math.floor(elapsed / 60);
  let seconds = Math.floor(elapsed % 60);
  return `${minutes}:${padNumber(seconds)}`;
}

function updateTimer() {
  TIMER.textContent = getFormattedTime();
}

function setElapsedSeconds(seconds, update) {
  TIMER.setAttribute("data-seconds", seconds);
  if (update) {
    updateTimer();
  }
}

function startTimer() {
  setElapsedSeconds(1, true);
  timerTask = setInterval(
    () => setElapsedSeconds(getElapsedSeconds() + 1, true),
    1000
  );
}

function getElapsedSeconds() {
  return parseInt(TIMER.getAttribute("data-seconds")) || 0;
}

function stopTimer() {
  clearInterval(timerTask);
  setElapsedSeconds(0, true);
}

function gameIsOver() {
  return Array.from(CARDS_CONTAINER.children)
    .filter(e => e.tagName === "LI")
    .every(c => c.classList.contains("match"));
}

function endGame() {
  resetBoard();
  drawGame();
  stopTimer();
  setAttempts(0);
  updateStars(getAttempts());
  setElapsedSeconds(-1, false);
}

function addNewCard(icon) {
  let card = document.createElement("li");
  card.classList.add("card");
  card.innerHTML = `<i class="${icon}"></i>`;
  CARDS_CONTAINER.appendChild(card);
  return card;
}

function starScoreOf(attempts) {
  if (attempts <= 15) {
    return 3;
  } else if (attempts <= 20) {
    return 2;
  } else {
    return 1;
  }
}

function hideStars() {
  Array.from(STARS_CONTAINER.children).forEach(
    star => (star.style.visibility = "hidden")
  );
}

function updateStars(attempts) {
  let stars = starScoreOf(attempts);
  hideStars();
  for (let i = 0; i < stars; i++) {
    STARS_CONTAINER.children[i].style.visibility = null;
  }
}

function resetBoard() {
  Array.from(CARDS_CONTAINER.children).forEach(child =>
    CARDS_CONTAINER.removeChild(child)
  );
}

function setAttempts(number) {
  ATTEMPT_COUNTER.textContent = number;
  if (number > 1 || number <= 0) {
    ATTEMPT_TEXT.textContent = "Attempts";
  } else {
    ATTEMPT_TEXT.textContent = "Attempt";
  }
}

function getAttempts() {
  return parseInt(ATTEMPT_COUNTER.textContent) || 0;
}

function drawGame() {
  let revealedCard;

  for (let j = 0; j < 2; j++) {
    let shuffledIcons = ICONS.sort(i => Math.random() < 0.7);
    for (let i = 0; i < shuffledIcons.length; i++) {
      let card = addNewCard(shuffledIcons[i]);

      card.addEventListener("click", () => {
        if (revealedCard === card || isMatched(card)) {
          return;
        }

        if (getElapsedSeconds() === -1) {
          startTimer();
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
          setAttempts(getAttempts() + 1);
          updateStars(getAttempts());
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

RESTART_BUTTON.addEventListener("click", endGame);

drawGame();
