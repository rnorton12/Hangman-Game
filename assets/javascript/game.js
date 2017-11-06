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
var winCount = 0;
var letter;
var solved; // the user guessed the word before exhausting number of guesse
var guessesRemaining;
var hangManWord;
var solvedWord = "";;
var gameStarted = false;
var lettersGuessed = [];
var underScore = "_";
var space = " ";

document.onkeyup = function (event) {
    // Capture the key press, convert it to lowercase, and save it to a variable.
    letter = String.fromCharCode(event.keyCode).toLowerCase();

    if (gameStarted === false) {
        startGame();
        console.log("Starting New Game");
    } else {
        guessWord();
    }
    updateWebPage();

    // has the user exhausted guessesRemaining or
    // solved the word?
    if ((solved) || (guessesRemaining === 0)) {
        if (solved) {
            console.log("you Won");
            // increment wins by 1 and
            winCount++;
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
    solved = false;
    gameStarted = true;
    lettersGuessed.length = 0;
    // Randomly chooses a state from the options usaStates array.
    // This will be the word that the user has to solve.
    hangManWord = usaStates[Math.floor(Math.random() * usaStates.length)];

    // fill the solved word with "_" to the length of the hangManWord
    solvedWord = fillString(underScore, hangManWord.length);

    // if the hangManWord contains any spaces then account for those
    var indices = [];
    var pos = 0;

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
       
    

} // end outer document.onkeyup = function(event) {

function guessWord() {
    var pos = 0;
    console.log("You guessed the letter: " + letter);
    
    // if letter has already been used don't count it
    pos = lettersGuessed.indexOf(letter.toLowerCase());
    if (pos !== -1) {
        html = "<P>" + "you already tried the letter " + letter + " ." + "</p>";
        console.log("you already tried this letter.");
    } else {
        // add this letter to the letterGuessed array
        lettersGuessed.push(letter.toLowerCase());
        html = "";
    }
    document.querySelector("#guessedLetterRepeated").innerHTML = html;
       
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

function updateWebPage() {
    var html;

    console.log("solvedWord.length: " + solvedWord.length);
    html = "<span>"; // open tag
    for (var i = 0; i < solvedWord.length; i++) {
        if ( i === 0 ) { // first letter of word
            html += solvedWord.charAt(i) + "*";
          } else if (i === solvedWord.length - 1) { // last letter
            html += "*" + solvedWord.charAt(i);
        } else if (solvedWord.charAt(i) != space) { // letter between first and last in word
            html += solvedWord.charAt(i) + "*";   
        } else { // this is a space in the word, add additional space for display
            html += "*" + "*" + solvedWord.charAt(i);
            console.log("found a space");
        }
    }
    html += "</span>"; // add closing tag
    document.querySelector("#currentWord").innerHTML = html;
    console.log("html: " + html);

    html = "<p>" + "Wins: " + winCount + "</p>";
    document.querySelector("#winCount").innerHTML = html;

    html = "<p>" + "Guesses Remaining: " + guessesRemaining + "</p>";
    document.querySelector("#guessesRemaining").innerHTML = html;
    
    html = "<p>" + "Letters Guessed: ";
    if (lettersGuessed.length) {
       html += lettersGuessed.toString();
    }
    html += "</p>";
    document.querySelector("#lettersGuessed").innerHTML = html;
}
