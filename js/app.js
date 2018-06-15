const CARDS_CONTAINER = document.querySelector('.deck');
const SCOREBOARD_TIMER = document.querySelector('.timer');
const SCOREBOARD_STARS = document.querySelector('.stars');
const ATTEMPT_COUNTER = document.querySelector('.attemptCounter');
const ATTEMPT_TEXT = document.querySelector('.attemptText');
const RESTART_BUTTON = document.querySelector('.restart');
const MODAL = document.querySelector('#modal');
const MODAL_TIME = document.querySelector('.modalTime');
const MODAL_STARS = document.querySelector('.modalStars');
const MODAL_ATTEMPTS = document.querySelector('.modalAttempts');
const MODAL_CLOSE_BUTTON = document.querySelector('.modalCloseBtn');
const MODAL_PLAY_AGAIN_BUTTON = document.querySelector('.modalRestartBtn');

const ICONS = [
  'fab fa-bitcoin',
  'fas fa-dollar-sign',
  'fab fa-ethereum',
  'fas fa-euro-sign',
  'fas fa-pound-sign',
  'fas fa-ruble-sign',
  'fas fa-shekel-sign',
  'fas fa-yen-sign'
];

function hideModal() {
  MODAL.hidden = true;
}

/**
 * Updates modal's displayed stats.
 * You should usually call this
 * before showModal().
 */
function updateModal() {
  updateTimer(MODAL_TIME);
  updateStars(getAttempts(), MODAL_STARS);
  MODAL_ATTEMPTS.textContent = getAttempts();
}

function showModal() {
  MODAL.hidden = false;
}

/**
 * Returns the Font Awesome icon name of this card
 */
function iconOfCard(card) {
  return card.children[0].getAttribute('class');
}

/**
 * Cards are considered matching
 * when they have the same icon.
 */
function cardsMatch(...cards) {
  return cards.every(c1 =>
    cards.every(c2 => iconOfCard(c1) === iconOfCard(c2))
  );
}

function reveal(...cards) {
  cards.forEach(card => card.classList.add('reveal', 'open'));
}

function hide(...cards) {
  cards.forEach(card => card.classList.remove('reveal', 'open'));
}

function match(...cards) {
  cards.forEach(card => card.classList.add('match'));
}

/**
 * A card is matched when:
 * - it is not undefined, and
 * - it has the class 'match'
 */
function isMatched(card) {
  return card != undefined && card.classList.contains('match');
}

/**
 * Pads a number.
 * For example, the input 5 would return 05
 * and the input 50 would return 50.
 */
function padNumber(number) {
  return number.toString().length == 1 ? '0' + number : number.toString();
}

/**
 * Returns easy-to-recognize, human-readable time format.
 * For example, if 75 seconds have elapsed,
 * the return will be 1:15.
 */
function getFormattedTime() {
  let elapsed = getElapsedSeconds();
  let minutes = Math.floor(elapsed / 60);
  let seconds = Math.floor(elapsed % 60);
  return `${minutes}:${padNumber(seconds)}`;
}

/**
 * Updates the score panel timer
 * to the formatted elapsed time.
 */
function updateTimer(element) {
  element.textContent = getFormattedTime();
}

/**
 * Sets the elapsed seconds.
 * Reset to -1 without updates
 * to reset the timer after a game.
 *
 * @param {boolean} update Whether or not to update the displayed time
 */
function setElapsedSeconds(seconds, update) {
  SCOREBOARD_TIMER.setAttribute('data-seconds', seconds);
  if (update) {
    updateTimer(SCOREBOARD_TIMER);
  }
}

let timerTask;
/**
 * Starts the timer. Increments the timer
 * by 1 every second.
 */
function startTimer() {
  setElapsedSeconds(1, true);
  timerTask = setInterval(
    () => setElapsedSeconds(getElapsedSeconds() + 1, true),
    1000
  );
}

function getElapsedSeconds() {
  return parseInt(SCOREBOARD_TIMER.getAttribute('data-seconds')) || 0;
}

/**
 * Stops and clears the timer.
 */
function stopTimer() {
  clearInterval(timerTask);
  setElapsedSeconds(0, true);
}

/**
 * Returns true if all list elements
 * within the deck are matched as determined
 * by isMatched(card).
 */
function gameIsOver() {
  return Array.from(CARDS_CONTAINER.children)
    .filter(e => e.tagName === 'LI')
    .every(c => isMatched(c));
}

/**
 * Ends the game. This will reset the game
 * and draw a new board if the user did not
 * win; otherwise, it will show the end game
 * modal.
 *
 * @param {*} wonGame Whether or not the user won the game
 */
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

/**
 * Adds a new card with the given icon
 *
 * @param {*} icon The Font Awesome icon to use
 */
function addNewCard(icon) {
  let card = document.createElement('li');
  card.classList.add('card');
  card.innerHTML = `<i class='${icon}'></i>`;
  CARDS_CONTAINER.appendChild(card);
  return card;
}

/**
 * Returns how many stars
 * you get for a given amount
 * of attempts.
 */
function starScoreOf(attempts) {
  if (attempts <= 16) {
    return 3;
  } else if (attempts <= 24) {
    return 2;
  } else {
    return 1;
  }
}

/**
 * Hides the stars in a given element,
 * while preserving the spacing.
 */
function hideStars(element) {
  Array.from(element.children).forEach(
    star => (star.style.visibility = 'hidden')
  );
}

/**
 * Updates the stars of an element
 * based on the given number of attempts.
 * The amount of stars shown is determined
 * by the result of starScoreOf(attempts).
 */
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

/**
 * Gets the current amount of attempts.
 * If for some reason the text content
 * of the attempt counter could not be
 * parsed as an int, this will default
 * to 0.
 */
function getAttempts() {
  return parseInt(ATTEMPT_COUNTER.textContent) || 0;
}

function setAttempts(number) {
  ATTEMPT_COUNTER.textContent = number;
  if (number > 1 || number <= 0) {
    ATTEMPT_TEXT.textContent = 'Attempts';
  } else {
    ATTEMPT_TEXT.textContent = 'Attempt';
  }
}

/**
 * Draws the game by shuffling the array of icons
 * and adding them to the game board with click logic.
 */
function drawGame() {
  /*
   * Declared here so that all 
   * cards share the same revealed card.
   */
  let revealedCard;

  for (let j = 0; j < 2; j++) {
    /*
     * Here we abuse the sort function  
     * to randomly shuffle the icons.
     */
    let shuffledIcons = ICONS.sort(i => Math.random() < 0.7);
    for (let i = 0; i < shuffledIcons.length; i++) {
      let card = addNewCard(shuffledIcons[i]);

      card.addEventListener('click', () => {
        // Ignore clicks on same card or already matched cards
        if (revealedCard === card || isMatched(card)) {
          return;
        }

        // The elapsed seconds is -1 if timer hasn't been started yet
        if (getElapsedSeconds() === -1) {
          startTimer();
        }

        reveal(card);

        // Revealed card != undefined when a card is currently revealed
        if (revealedCard !== undefined) {
          if (cardsMatch(revealedCard, card)) {
            match(card, revealedCard);
          } else {
            // Holds the originally revealed card until next click
            let cardToHide = revealedCard;
            // Waiting 1ms to prevent the two cards from hiding because of this click event
            setTimeout(
              () =>
                CARDS_CONTAINER.addEventListener(
                  'click',
                  (hider = e => {
                    // If they clicked on the icon, we want its parent element (the card)
                    let targetCard =
                      e.target.tagName === 'I'
                        ? e.target.parentElement
                        : e.target;

                    // Hides card only if its not the target card
                    [cardToHide, card]
                      .filter(c => c !== targetCard)
                      .forEach(c => hide(c));

                    CARDS_CONTAINER.removeEventListener('click', hider);
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
          endGame(true);
        }
      });
    }
  }
}
+RESTART_BUTTON.addEventListener('click', () => endGame(false));

MODAL_CLOSE_BUTTON.addEventListener('click', hideModal);

// Restart the game by simulating clicks on the modal close and restart button
MODAL_PLAY_AGAIN_BUTTON.addEventListener('click', () => {
  MODAL_CLOSE_BUTTON.click();
  RESTART_BUTTON.click();
});

drawGame();
