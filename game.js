var wordList = [
    {word: "BOGGS", explanation: "For the Boggs Building!"}, 
    {word: "BROCK", explanation: "For the Brock Football Practice Facility! (it's really hard to come up with words)"}, 
    {word: "RATIO", explanation: "gotta keep raising it"}, 
    {word: "NAKED", explanation: "Fight, win, drink, get ____."}, 
    {word: "CIVIL", explanation: "This is a type of engineering."}, 
    {word: "KALDI", explanation: "She has some pretty good coffee."}, 
    {word: "ALANA", explanation: "IThe real way to pronounce Atlanta"}, 
    {word: "AAAAA", explanation: "none"}, 
    {word: "AAAAA", explanation: "none"}, 
    {word: "AAAAA", explanation: "none"}, 
    {word: "AAAAA", explanation: "none"},
    {word: "AAAAA", explanation: "none"}, 
    {word: "AAAAA", explanation: "none"}, 
    {word: "AAAAA", explanation: "none"}, 
    {word: "AAAAA", explanation: "none"}, 
    {word: "AAAAA", explanation: "none"}, 
    {word: "SWARM", explanation: "Together we Swarm!"}, 
    {word: "STING", explanation: "Sting 'em!"},
    {word: "ROBOT", explanation: "idk robots seem techy"}, 
    {word: "GREEK", explanation: "Greek life exists here."}, 
    {word: "OSCAR", explanation: "My demise"}, 
    {word: "HOWEY", explanation: "For the Howey Physics Building!"}, 
    {word: "COUCH", explanation: "For the Couch Building!"}, 
    {word: "FERST", explanation: "For Ferst Drive and Ferst Center for the Arts!"}, 
    {word: "MASON", explanation: "For the Mason Building!"}, 
    {word: "STUDY", explanation: "What you should be doing right now"}, 
    {word: "ANNIE", explanation: "Annie T. Wise was the first female graduate at Georgia Tech!"}, 
    {word: "PEACE", explanation: "William Peace was the first black instructor at Georgia Tech!"}, 
    {word: "EDDIE", explanation: "Eddie McAshen was the first African American football player to start for Georgia Tech!"}, 
    {word: "BOBBY", explanation: "For the Bobby Dodd Stadium!"}, 
    {word: "SMITH", explanation: "For the D. M. Smith Building and the Smith Residence Hall."},
];


let targetWord = "";
let explan = ""; 
const today = new Date();
let results = `What's the Good Word(le) ${today.getMonth() + 1}/${today.getDate()}\n`;


function getWordOfTheDay() {
    const today = new Date();
    const dayOfMonth = today.getDate();

    if (wordList.length < dayOfMonth) {
        console.warn("Not enough words for each day of the month");
    }

    const entry = wordList[(dayOfMonth - 1) % wordList.length];
    explan = entry.explanation; 
    return entry.word; 
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
    let explan = "";
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
    console.log(results);
    const guessLetters = [];
    const animations = new Array(10).fill(null); 
    const targetLetterCounts = {};
    let isCorrect = 0;
    results+="\n";

    for (const letter of targetWord) {
        targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
    }


    console.log(targetLetterCounts);

    const startIdx = currentRow * 5;

    for (let i = 0; i < 5; i++) {
        const square = squares[startIdx + i];
        const guessedLetter = guess[i];

        if (!(guessLetters.includes(guessedLetter)) && guessedLetter != "ENTER") {
            guessLetters.push(guessedLetter);
        }

        if (guessedLetter === targetWord[i]) {
            animations[i] = () => {
                square.style.transition = "background-color 0.4s ease";
                square.style.backgroundColor = correctColor; // green
                square.style.color = "white";
            };
            targetLetterCounts[guessedLetter]--;
            isCorrect++;
            results+="&#128154;";
        }
    }

    for (let i = 0; i < 5; i++) {
        const square = squares[startIdx + i];
        const guessedLetter = guess[i];

        if (animations[i]) continue;

        if (targetLetterCounts[guessedLetter] > 0) {
            animations[i] = () => {
                square.style.transition = "background-color 0.4s ease";
                square.style.backgroundColor = presentColor; // yellow
                square.style.color = "white";
            };
            targetLetterCounts[guessedLetter]--;
            results+="&#128155;";
        } else {
            animations[i] = () => {
                square.style.transition = "background-color 0.4s ease";
                square.style.backgroundColor = absentColor; // red
                square.style.color = "white";
            };
            results+="&#129654;";
        }
        
    }

    for (let i = 5; i < 11; i++) {
        console.log(guessLetters);
        const lett = guessLetters.pop();
        console.log(lett);
        const ind = "QWERTYUIOPASDFGHJKLXZXCVBNMX".indexOf(lett);

        const key = keys[ind];
        animations[i] = () => {
            key.style.transition = "background-color 0.25s ease";
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
            
            // export { results } 
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
    // Attach listeners to each key on the on-screen keyboard
    keys.forEach((key) => {
        key.addEventListener("click", () => {
            const keyContent = key.textContent;
            handleInput(keyContent === "ENTER" ? "Enter" : keyContent);
        });
    });

    // Attach listener for physical keyboard input
    document.addEventListener("keydown", (e) => {
        const key = e.key.toUpperCase();
        
        // Only handle valid inputs (letters, Enter, or Backspace)
        if ((key >= "A" && key <= "Z") || key === "ENTER" || key === "BACKSPACE") {
            handleInput(key === "BACKSPACE" ? "⌫" : key === "ENTER" ? "Enter" : key);
        }
    });
}



initializeGame();
export { explan, results };
