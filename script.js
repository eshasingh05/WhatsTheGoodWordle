// sample word list (you can expand this)
const wordList = ["apple", "table", "chair", "plane", "store"];
let targetWord = "";

// Background color customization (change hex codes here)
const correctColor = "#2d8541"; // green
const presentColor = "#ffd633"; // yellow
const absentColor = "#ba2525"; // red

// initialize grid and keyboard
const squares = document.querySelectorAll(".square");
const keys = document.querySelectorAll(".key");

// function to select a new word and remove it from the word list
function selectNewWord() {
    if (wordList.length === 0) {
        alert("No more words left!");
        return;
    }
    const randomIndex = Math.floor(Math.random() * wordList.length);
    targetWord = wordList.splice(randomIndex, 1)[0];
    console.log("New target word:", targetWord); // for debugging
}

// set the word at midnight
function scheduleMidnightReset() {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = nextMidnight - now;
    setTimeout(() => {
        selectNewWord();
        scheduleMidnightReset();
    }, timeUntilMidnight);
}

// initialize game
function initializeGame() {
    selectNewWord();
    scheduleMidnightReset();
    setupKeyboardListeners();
}

// handle user input
let currentGuess = "";
let currentRow = 0;

function handleInput(letter) {
    if (letter === "Enter") {
        if (currentGuess.length === 5) {
            console.log("Submitted guess:", currentGuess); // for debugging
            checkGuess(currentGuess);
            currentGuess = "";
            currentRow++;
        }
    } else if (letter === "⌫") {
        if (currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1);
            updateGrid();
        }
    } else if (currentGuess.length < 5) {
        currentGuess += letter;
        updateGrid();
    }
}

// update the grid based on current guess
function updateGrid() {
    const startIdx = currentRow * 5;
    for (let i = 0; i < 5; i++) {
        const square = squares[startIdx + i];
        square.textContent = currentGuess[i] || "";
        square.style.display = "flex"; // Center text
        square.style.justifyContent = "center";
        square.style.alignItems = "center";
        square.style.fontSize = "24px"; // Adjust font size for larger text
        square.style.fontWeight = "bold"; // Optional for emphasis
        
    }
}

// check the guess
function checkGuess(guess) {
    const targetLetterCounts = {};
    const animations = [];

    // Count occurrences of each letter in the target word
    for (const letter of targetWord) {
        targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
    }

    const startIdx = currentRow * 5;
    let isCorrect = true;

    // First pass: Check for correct positions (green)
    for (let i = 0; i < 5; i++) {
        const square = squares[startIdx + i];
        const guessedLetter = guess[i];

        if (guessedLetter === targetWord[i]) {
            animations.push(() => {
                square.style.transition = "background-color 0.5s ease";
                square.style.backgroundColor = correctColor; // Use custom color
                square.style.color = "white"; // Use custom color
            });
            targetLetterCounts[guessedLetter]--;
        } else {
            isCorrect = false;
        }
    }

    // Second pass: Check for incorrect positions (yellow) or absent letters (red)
    for (let i = 0; i < 5; i++) {
        const square = squares[startIdx + i];
        const guessedLetter = guess[i];

        if (!square.style.backgroundColor) {
            if (targetLetterCounts[guessedLetter] > 0) {
                animations.push(() => {
                    square.style.transition = "background-color 0.5s ease";
                    square.style.backgroundColor = presentColor; // Use custom color
                    square.style.color = "white"; // Use custom color
                });
                targetLetterCounts[guessedLetter]--;
            } else {
                animations.push(() => {
                    square.style.transition = "background-color 0.5s ease";
                    square.style.backgroundColor = absentColor; // Use custom color
                    square.style.color = "white"; // Use custom color
                });
            }
        }
    }

    // Execute animations sequentially
    animations.forEach((animate, index) => {
        setTimeout(animate, index * 500);
    });

    // Display alerts after animations
    setTimeout(() => {
        if (isCorrect) {
            alert("You guessed the word!");
        } else if (currentRow >= 5) {
            alert("Game over! The word was: " + targetWord);
        }
    }, animations.length * 500);
}

// setup keyboard listeners
function setupKeyboardListeners() {
    keys.forEach((key) => {
        key.addEventListener("click", () => handleInput(key.textContent));
    });

    document.addEventListener("keydown", (e) => {
        const key = e.key.toUpperCase();
        // Prevent the "Meta" (Command) key from affecting the input
        if (e.metaKey) {
            e.preventDefault();
            return;
        }
    
        // Only allow letters A-Z, Enter, and Backspace
        if ((key >= "A" && key <= "Z") || key === "ENTER" || key === "BACKSPACE") {
            handleInput(key === "BACKSPACE" ? "⌫" : key);
        }
    });
}

// start the game
initializeGame();
