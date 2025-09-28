const randomIndex = Math.floor(Math.random() * words.length); // Pick a random index from the word list so we can choose a random word for the game
const hangmanImg = document.querySelector(".hangman-box img");
let selectedWordObj = words[randomIndex];  // { word: 'APPLE', hint: 'A fruit...' }
let word = selectedWordObj.word.toUpperCase(); // the word we’ll guess

// Keep track of the game state

let guessedLetters = []; // letters the player has already guessed
let lives = 6; // number of lives at the start  
let gameOver = false; // becomes true if player wins or loses

// Function to update the word and lives display

function updateDisplay() {
    let displayWord = "";

   // Show guessed letters, hide others as "_


    for (let letter of word) {
        if (guessedLetters.includes(letter)) {
            displayWord += letter + " ";
        } else {
            displayWord += "_ ";
        }
    }

       //Update the HTML with the current word and lives
    document.getElementById("word").innerText = displayWord.trim();
    document.getElementById("lives").innerText = `Lives left: ${lives}`;

    if (lives === 1) {
        document.getElementById("hint").innerText = `Hint: ${selectedWordObj.hint}`;
    } else {
        document.getElementById("hint").innerText = "";
    }

    }
    
function updateHangmanImage() {
    const imageIndex = 6 - lives;
    hangmanImg.src = `images/hangman-${imageIndex}.svg`;
}

// Call once at the start to show the empty underscores

updateDisplay();

// Create the on-screen keyboard

const keyboardDiv = document.getElementById("keyboard");
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

for (let letter of letters) {
    const button = document.createElement("button");
    button.innerText = letter;

       // When button is clicked, handle the guess
    button.addEventListener("click",  () => handleGuess(letter, button));

    keyboardDiv.appendChild(button);
}

// Physical keyboard support
document.addEventListener("keydown", (event) => {
    if (gameOver) return; // oyun bitmişse ignore

    const key = event.key.toUpperCase(); // büyük harfe çevir

    // Sadece A-Z harfleri kabul et
    if (!/^[A-Z]$/.test(key)) return;

    // Daha önce tıklanmış mı kontrol et
    if (guessedLetters.includes(key)) return;

    // Klavyedeki ilgili butonu bul (ekran tuşu)
    const button = Array.from(document.querySelectorAll("#keyboard button"))
        .find(btn => btn.innerText === key);

    if (button) {
        handleGuess(key, button); // mevcut fonksiyonunu çağır
    }
});

// Enter key to play again
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && gameOver) {
        resetGame();
    }
});

// Handle a guess

function handleGuess(letter, button) {
    if (gameOver) return;  // Stop if game already ended

    // If this letter was already guessed, do nothing (prevents auto-repeat from keyboard)
    if (guessedLetters.includes(letter)) return;

    // Disable the button (if available) so it's visibly disabled immediately
    if (button) button.disabled = true;

    // Mark letter as guessed to prevent repeated handling
    guessedLetters.push(letter);

    // If guess is incorrect, decrease lives and update image
    if (!word.includes(letter)) {
        lives--;
        updateHangmanImage();
    }

    updateDisplay();
    checkGameOver();
}

// Check win or lose
function checkGameOver() {
    const currentDisplay = document.getElementById("word").innerText;
    if (lives <= 0) {
        document.getElementById("message").innerText = `Game Over! The word was ${word}`;
        gameOver = true;
        playAgainBtn.style.display = "inline-block"; 
    } else if (!currentDisplay.includes("_")) {
        document.getElementById("message").innerText = "Congratulations! You guessed it!";
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