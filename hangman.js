const randomIndex = Math.floor(Math.random() * words.length); 
const hangmanImg = document.querySelector(".hangman-box img");
let selectedWordObj = words[randomIndex]; 
let word = selectedWordObj.word.toUpperCase(); 
let guessedLetters = []; 
let lives = 6; 
let gameOver = false;

function updateDisplay() {
    let displayWord = "";

    for (let letter of word) {
        if (guessedLetters.includes(letter)) {
            displayWord += letter + " ";
        } else {
            displayWord += "_ ";
        }
    }

    document.getElementById("word").innerText = displayWord.trim();
    document.getElementById("lives").innerText = `Lives left: ${lives}`;

    if (lives === 1) {
        document.getElementById("hint").innerText = `Hint: ${selectedWordObj.hint}`;
        document.getElementById("lives").innerText = "Only one life left!";
    } else {
        document.getElementById("hint").innerText = "";
    }

    }
    
function updateHangmanImage() {
    const imageIndex = 6 - lives;
    hangmanImg.src = `images/hangman-${imageIndex}.svg`;
}

updateDisplay();

const keyboardDiv = document.getElementById("keyboard");
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

for (let letter of letters) {
    const button = document.createElement("button");
    button.innerText = letter;
    button.addEventListener("click",  () => handleGuess(letter, button));
    keyboardDiv.appendChild(button);
}


document.addEventListener("keydown", (event) => {
    if (gameOver) return; 
    const key = event.key.toUpperCase(); 

    if (!/^[A-Z]$/.test(key)) return;
    if (guessedLetters.includes(key)) return;

    const button = Array.from(document.querySelectorAll("#keyboard button"))
        .find(btn => btn.innerText === key);

    if (button) {
        handleGuess(key, button); 
    }
});


document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && gameOver) {
        resetGame();
    }
});


function handleGuess(letter, button) {
    if (gameOver) return; 
    if (guessedLetters.includes(letter)) return;
    if (button) button.disabled = true;
    guessedLetters.push(letter);
    if (!word.includes(letter)) {
        lives--;
        updateHangmanImage();
    }
    updateDisplay();
    checkGameOver();
}

function checkGameOver() {
    const currentDisplay = document.getElementById("word").innerText;
    if (lives <= 0) {
        document.getElementById("message").innerText = `Game Over! The word was ${word}`;
        gameOver = true;
        playAgainBtn.style.display = "inline-block"; 
    } else if (!currentDisplay.includes("_")) {
        document.getElementById("message").innerText = "Congratulations! You guessed the word!";
        gameOver = true;
        playAgainBtn.style.display = "inline-block"; 
    }
}

const playAgainBtn = document.getElementById("play-again");
playAgainBtn.addEventListener("click", () => {
    resetGame();
});

function resetGame() {
    const randomIndex = Math.floor(Math.random() * words.length);
    selectedWordObj = words[randomIndex];
    word = selectedWordObj.word.toUpperCase();

    guessedLetters = [];
    lives = 6;
    gameOver = false;
    
    document.getElementById("message").innerText = "";
    document.getElementById("hint").innerText = ""; 
    
    playAgainBtn.style.display = "none";

    const buttons = document.querySelectorAll("#keyboard button");
    buttons.forEach(btn => btn.disabled = false);

    updateDisplay();
    updateHangmanImage();
}
