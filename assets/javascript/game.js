// display requirements
// 1) Press any key to get started!
// 2) Number of Wins
// 3) current word with place holders for each letter in the word: _ _ _ _ _ _
// 4) Number of guesses remaining start at 12
// 5) letter already guessed
// ======================================================
// define variables
var usaStates = [
    "Alabama", "Arizona","Alaska", "Arkansas", "California",
    "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
    "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin","Wyoming"
];

// initialize some variables for start of game
var winsCount = 0;
var html;
var letter;
var solved; // the user guessed the word before exhausting number of guesses
var wordPlaceHolder;
var guessesRemaining;
var hangManWord;
var solvedWord;
var gameStarted = false;
var lettersGuessed = [];

document.onkeyup = function (event) {
    // Capture the key press, convert it to lowercase, and save it to a variable.
    letter = String.fromCharCode(event.keyCode).toLowerCase();

    if (gameStarted === false) {
        startGame();
        console.log("Starting New Game");
    } else {
        guessWord();
    }

    // has the user exhausted guessesRemaining or
    // solved the word?
    if ((solved) || (guessesRemaining === 0)) {
        if (solved) {
            console.log("you Won");
            // increment wins by 1 and
            winsCount++;
        } else { // guessesRemain equals 0
            // you lost
            console.log("You Lost");
        }
        
        // reset gameStarted to false to start a new game
        gameStarted = false;
    }
}

function startGame () { // initial key press to start the game
        
    guessesRemaining = 12;
    wordPlaceHolder = "";
    solved = false;
    gameStarted = true;
    // Randomly chooses a state from the options usaStates array.
    // This will be the word that the user has to solve.
    hangManWord = usaStates[Math.floor(Math.random() * usaStates.length)];

    // fill the solved word with "#" to the length of the hangManWord
    solvedWord = fillString("#", hangManWord.length);

    // if the hangManWord contains any spaces then account for those
    var indices = [];
    var pos = 0;
    var space = " ";

    while ((pos = hangManWord.toLowerCase().indexOf(space, pos)) !== -1) {
        indices.push(pos);
        pos++;
    }

    if (indices.length) {
        for (var i = 0; i < indices.length; i++) {
            solvedWord = setCharAt(solvedWord, indices[i], space); 
        }
    }

    console.log("the hangManWord is: " + hangManWord);
    console.log("length of word is: " + hangManWord.length); 

    console.log("the solvedWord is: " + solvedWord);
    console.log("length of word is: " + solvedWord.length);
       
    for (var i = 0; i < hangManWord.length; i++) {
        // create a placeholder for each letter of the current word.
        wordPlaceHolder += '_';

        if (i < hangManWord.length -1) {
            wordPlaceHolder += ' ';
        }
    }

    // construct the html for the word place holder
    console.log("wordPlaceHolder: " + wordPlaceHolder);
    html = "<p>" + wordPlaceHolder + "</p>";
    console.log("html: " + html);

    // Set the inner HTML contents of the #currentWord div to our html string
    document.querySelector("#currentWord").innerHTML = html;

} // end outer document.onkeyup = function(event) {

function guessWord() {
    var pos = 0;
    console.log("You guessed the letter: " + letter);
    
    // if letter has already been used don't count it
    pos = lettersGuessed.indexOf(letter.toLowerCase());
    if (pos !== -1) {
        console.log("you already tried this letter.");
    } else {
        // add this letter to the letterGuessed array
        lettersGuessed.push(letter);
    }  
    
   
    // does the letter exist in the hangManWord?
    var indices = [];
    pos = 0;
    while ((pos = hangManWord.toLowerCase().indexOf(letter.toLowerCase(), pos)) !== -1) {
        indices.push(pos);
        pos++;
    }
    
    if (indices.length) {
        console.log("indices = " + indices.toString());
        // add the letter to solvedWord at the appropriate position
        for (var i = 0; i < indices.length; i++) {
            solvedWord = setCharAt(solvedWord, indices[i], hangManWord.charAt(indices[i])); 
        }
        console.log("solvedWord: " + solvedWord);

        // see if the user guessed all the letters
        if (solvedWord === hangManWord) {
            solved = true;
        }
    } else {
        console.log("not found");
        // letter was not found, decrement guessesRemaining by 1
        guessesRemaining -= 1;
    }
    
    
/*
    console.log("pos: " + pos);
    if (pos !== -1) { // correct guess
        console.log("position of letter in handManWord is: " + pos);
        if ((pos === 0) || (pos === hangManWord.length)) { // first letter or last letter
            wordPlaceHolder[pos] = letter; 
        } else { // have to account for spaces between letters
            wordPlaceHolder[pos + 1];
        }
        html = "<p>" + wordPlaceHolder + "</p>";
        console.log("html: " + html);
    } else { // incorrect guess 
        guessesRemaining -= 1;
    }   
    */ 
}

function fillString(withChar, length) {
    var myString ="";
   
    for (var i = 0; i < length; i++) {
        myString = myString.concat(withChar);
    }
   
    return myString;
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

// 2) then need to display a place holder for each letter in the state selected
// like this: _ _ _ _ _

// 3) get a letter guess from the user from A to Z.

// 4) if the letter guessed is contained in the current word then,
// replace the letter place holder at the appropriate position with the current letter.

// 5) if the letter guessed is NOT contained in the current word then,
// subtract 1 from the number of guesses remaining.

// 6) add the letter selected to the letter already guessed display area.

// 7) has the user solved the puzzle?
// if yes then,
// add 1 to the number of wins then,
// go back to step 1 to prepare for next game
// if no then,
// continue

// 7) if the number of guesses remaining is not 0,
// then go back to step 3.

// 8) if the number of guesses remaining is 0,
// then go back to step 1.
