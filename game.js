var wordList = ["KLAUS", "WRECK", "ANGEL", "SWARM", "STING", "LEWIS", "MASON", "GREEN", "HOWEY", "COUCH", "FERST", "BROWN", "SMITH"];
let targetWord = "";

    
function getWordOfTheDay() {
    const today = new Date();
    const dayOfMonth = today.getDate(); 
      
    const totalDaysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      
    if (wordList.length < totalDaysInMonth) {
        console.warn('Not enough words for each day of the month');
    }
    
    return wordList[(dayOfMonth - 1) % wordList.length]; 
}


const correctColor = "#2d8541"; // green
const presentColor = "#e6bf00"; // yellow
const absentColor = "#ba2525"; // red
const usedColor = "#436391"; // blue

// initialize grid and keyboard
const squares = document.querySelectorAll(".square");
const keys = document.querySelectorAll(".key");

// initialize game
function initializeGame() {
    
    targetWord = getWordOfTheDay();
    console.log(targetWord);
    setupKeyboardListeners();
}

// handle user input
let currentGuess = "";
let currentRow = 0;

function handleInput(letter) {


    if (letter === "Enter") {
        if (currentGuess.length === 5) {
            console.log("Submitted guess: ", currentGuess); 
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
        square.style.display = "flex"; 
        square.style.justifyContent = "center";
        square.style.alignItems = "center";
        square.style.fontSize = "24px"; 
        square.style.fontWeight = "bold"; 
        
    }
}

function checkGuess(guess) {
    const guessLetters = [];
    const animations = new Array(10).fill(null); 
    const targetLetterCounts = {};
    let isCorrect = 0;

    for (const letter of targetWord) {
        targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
    }


    console.log(targetLetterCounts);

    const startIdx = currentRow * 5;

    for (let i = 0; i < 5; i++) {
        const square = squares[startIdx + i];
        const guessedLetter = guess[i];

        if (!(guessLetters.includes(guessedLetter))) {
            guessLetters.push(guessedLetter);
        }

        if (guessedLetter === targetWord[i]) {
            animations[i] = () => {
                square.style.transition = "background-color 0.5s ease";
                square.style.backgroundColor = correctColor; // green
                square.style.color = "white";
            };
            targetLetterCounts[guessedLetter]--;
            isCorrect++;
        }
    }

    for (let i = 0; i < 5; i++) {
        const square = squares[startIdx + i];
        const guessedLetter = guess[i];

        if (animations[i]) continue;

        if (targetLetterCounts[guessedLetter] > 0) {
            animations[i] = () => {
                square.style.transition = "background-color 0.5s ease";
                square.style.backgroundColor = presentColor; // yellow
                square.style.color = "white";
            };
            targetLetterCounts[guessedLetter]--;
        } else {
            animations[i] = () => {
                square.style.transition = "background-color 0.5s ease";
                square.style.backgroundColor = absentColor; // red
                square.style.color = "white";
            };
        }
        
    }

    for (i = 5; i < 11; i++) {
        console.log(guessLetters);
        const lett = guessLetters.pop();
        console.log(lett);
        const ind = "QWERTYUIOPASDFGHJKLXZXCVBNMX".indexOf(lett);

        const key = keys[ind];
        animations[i] = () => {
            key.style.transition = "background-color 0.5s ease";
            key.style.backgroundColor = usedColor; // blue
            key.style.color = "white";
        };
        
    }

    animations.forEach((animate, index) => {
        setTimeout(animate, index * 500);
    });

    setTimeout(() => {
        if (isCorrect === 5) {
            alert("You guessed the word!");

            setTimeout(() => {
                window.location.href = "end.html";
            }, 2000);

            
        } else if (currentRow >= 6) {
            alert("Game over! The word was: " + targetWord);
            setTimeout(() => {
                window.location.href = "end.html";
            }, 2000);
        }
    }, animations.length * 500);
}


function setupKeyboardListeners() {
    keys.forEach((key) => {
        key.addEventListener("click", () => handleInput(key.textContent));
    });

    document.addEventListener("keydown", (e) => {
        const key = e.key.toUpperCase();
        if (e.metaKey) {
            e.preventDefault();
            return;
        }
    
        if ((key >= "A" && key <= "Z") || key === "ENTER" || key === "BACKSPACE") {
            handleInput(key === "BACKSPACE" ? "⌫" : key);
        }
    });
}

initializeGame();
