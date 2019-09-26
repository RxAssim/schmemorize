require("../styles/index.scss");

// Used to get the images, 1 image per name
const NAMES = [
  "bill",
  "steve",
  "tim",
  "elon",
  "jeff",
  "satiya",
  "balmer",
  "mark"
];
// Global nodes
const container = document.querySelector(".container");
const board = document.querySelector(".board");
const startContainer = document.querySelector(".start");

// Global vars
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard, username;
let correctCards = 0;
let timer;
// Global consts
const INITIAL_TIME = 60;

// Creates and returns card as a DOM element
function createCardElement(title, src) {
  let cardContainer = document.createElement("div");
  cardContainer.className = "card";
  let frontFace = document.createElement("img");
  frontFace.className = "front";
  let backFace = document.createElement("img");
  backFace.className = "back";
  backFace.src = "./public/back.png";
  backFace.alt = "back face";
  frontFace.src = src;
  frontFace.alt = title;
  cardContainer.dataset.title = title;
  cardContainer.appendChild(frontFace);
  cardContainer.appendChild(backFace);
  return cardContainer;
}

// Restarts game timer
function restartTimer() {
  let timerNode = document.querySelector(".timer");
  timerNode.classList.remove("danger");
  timerNode.innerHTML = `You've got ${INITIAL_TIME}`;
  startTimer();
}

// Starts  game timer
function startTimer() {
  let timerNode = document.querySelector(".timer");
  let distance = INITIAL_TIME;
  timer = setInterval(() => {
    distance = distance - 1;

    timerNode.innerHTML = `You've got ${distance}`;

    if (distance < 20 && !timerNode.classList.contains("danger")) {
      timerNode.classList.add("danger");
    }

    if (distance < 1) {
      clearInterval(timer);
      showFailureModal();
    }
  }, 1000);
}

// Stops game timer
function stopTimer() {
  clearInterval(timer);
  let timerNode = document.querySelector(".timer");
  timerNode.innerHTML = "";
}

function startGame() {
  startTimer();
  let downloadedImages = 0;
  NAMES.forEach((name, index) => {
    // For each name, download an image, create 2 cards with that image
    return fetch(`http://localhost:8111/png/${name}/300`)
      .then(response => response.blob())
      .then(blob => {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
          let base64data = reader.result;
          const card = createCardElement(name, base64data);
          const cloneCard = card.cloneNode(true);
          card.addEventListener("click", flip);
          cloneCard.addEventListener("click", flip);
          board.appendChild(card);
          board.appendChild(cloneCard);
          downloadedImages++;
          if (downloadedImages === NAMES.length) {
            // ALL images are downloaded
            shuffle();
            container.classList.remove("hidden");
          }
        };
      });
  });
}

// called when user clicks on card to flip it
function flip() {
  // do nothing if the board is locked or card = first clicked
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flip");

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  // second click
  secondCard = this;

  // check if cards match
  if (firstCard.dataset.title === secondCard.dataset.title) {
    // cards match
    disableCards();
    correctCards++;
    if (correctCards === NAMES.length) {
      showSuccessModal();
    }
  } else {
    unflip();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flip);
  secondCard.removeEventListener("click", flip);

  continueGame();
}

function unflip() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    continueGame();
  }, 500);
}

function unflipAll() {
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.classList.remove("flip");
    card.addEventListener("click", flip);
  });
}

function continueGame() {
  hasFlippedCard = false;
  lockBoard = false;
  firstCard = null;
  secondCard = null;
}

// shuffle cards
function shuffle() {
  const cards = document.querySelectorAll(".card");
  cards.forEach(
    card => (card.style.order = Math.floor(Math.random() * NAMES.length * 2))
  );
}

function restartGame() {
  const modalNode = document.querySelector(".modal");
  let timerNode = document.querySelector(".timer");
  correctCards = 0;
  unflipAll();
  shuffle();
  restartTimer();
  continueGame();
  modalNode.style.display = "none";
}

window.addEventListener("load", function() {
  const singlePlayerForm = document.getElementById("single-player-form");
  const restartNode = this.document.getElementById("restartGame");
  restartNode.addEventListener("click", function(event) {
    restartGame();
  });
  singlePlayerForm.addEventListener("submit", function(event) {
    event.preventDefault();
    let username = event.target[0].value;
    startContainer.classList.add("hidden");
    let usernameNode = document.querySelector(".username");
    let textNode = document.createTextNode(`Go ${username} !`);
    usernameNode.appendChild(textNode);
    startGame();
  });
});

function showSuccessModal() {
  stopTimer();
  const modalNode = document.querySelector(".modal");
  const imageNode = document.querySelector(".modal-content img");
  const paragraphNode = document.querySelector(".modal-content p");
  imageNode.src = "./public/party.svg";
  imageNode.alt = "Party";
  paragraphNode.innerHTML = "Congrats ! You solved it";
  modalNode.style.display = "block";
}

function showFailureModal() {
  const modalNode = document.querySelector(".modal");
  const imageNode = document.querySelector(".modal-content img");
  const paragraphNode = document.querySelector(".modal-content p");
  imageNode.src = "./public/failed.svg";
  imageNode.alt = "Failed";
  paragraphNode.innerHTML = "Oops ! Try again";
  modalNode.style.display = "block";
}
