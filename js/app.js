const CARDS_CONTAINER = document.querySelector(".deck");
const SCOREBOARD_TIMER = document.querySelector(".timer");
const SCOREBOARD_STARS = document.querySelector(".stars");
const ATTEMPT_COUNTER = document.querySelector(".attemptCounter");
const ATTEMPT_TEXT = document.querySelector(".attemptText");
const RESTART_BUTTON = document.querySelector(".restart");
const MODAL = document.querySelector("#modal");
const MODAL_TIME = document.querySelector(".modalTime");
const MODAL_STARS = document.querySelector(".modalStars");
const MODAL_ATTEMPTS = document.querySelector(".modalAttempts");
const MODAL_CLOSE_BUTTON = document.querySelector(".closeModal");
const MODAL_PLAY_AGAIN_BUTTON = document.querySelector(".restartGame");

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

function hideModal() {
  MODAL.hidden = true;
}

function updateModal() {
  MODAL_TIME.textContent = getFormattedTime();
  updateStars(getAttempts(), MODAL_STARS);
  MODAL_ATTEMPTS.textContent = getAttempts();
}

function showModal() {
  MODAL.hidden = false;
}

function iconOfCard(card) {
  return card.children[0].getAttribute("class");
}

function cardsMatch(one, two) {
  return iconOfCard(one) === iconOfCard(two);
}

function reveal(...cards) {
  cards.forEach(card => card.classList.add("reveal", "open"));
}

function hide(...cards) {
  cards.forEach(card => card.classList.remove("reveal", "open"));
}

function match(...cards) {
  cards.forEach(card => card.classList.add("match"));
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
  SCOREBOARD_TIMER.textContent = getFormattedTime();
}

function setElapsedSeconds(seconds, update) {
  SCOREBOARD_TIMER.setAttribute("data-seconds", seconds);
  if (update) {
    updateTimer();
  }
}

let timerTask;

function startTimer() {
  setElapsedSeconds(1, true);
  timerTask = setInterval(
    () => setElapsedSeconds(getElapsedSeconds() + 1, true),
    1000
  );
}

function getElapsedSeconds() {
  return parseInt(SCOREBOARD_TIMER.getAttribute("data-seconds")) || 0;
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

function endGame(wonGame) {
if (!wonGame) {
  resetBoard();
  drawGame();
} else {
  updateModal();
  showModal();
}
  stopTimer();
  setAttempts(0);
  updateStars(getAttempts(), SCOREBOARD_STARS);
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
  if (attempts <= 16) {
    return 3;
  } else if (attempts <= 24) {
    return 2;
  } else {
    return 1;
  }
}

function hideStars(element) {
  Array.from(element.children).forEach(
    star => (star.style.visibility = "hidden")
  );
}

function updateStars(attempts, element) {
  let stars = starScoreOf(attempts);
  hideStars(element);
  for (let i = 0; i < stars; i++) {
    element.children[i].style.visibility = null;
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
          updateStars(getAttempts(), SCOREBOARD_STARS);
          revealedCard = undefined;
        } else {
          revealedCard = card;
        }

        if (gameIsOver()) {
          setTimeout(() => endGame(true), 1);
        }
      });
    }
  }
}

RESTART_BUTTON.addEventListener("click", () => endGame(false));

MODAL_CLOSE_BUTTON.addEventListener("click", hideModal);

MODAL_PLAY_AGAIN_BUTTON.addEventListener("click", () => {
  MODAL_CLOSE_BUTTON.click();
  RESTART_BUTTON.click();
});

drawGame();
