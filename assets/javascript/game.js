// display requirements
// 1) Press any key to get started!
// 2) Number of Wins
// 3) current word with place holders for each letter in the word: _ _ _ _ _ _
// 4) Number of guesses remaining start at 12
// 5) letter already guessed
// ======================================================

 // define array containing each state of the union
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
var solvedWord = "";
var gameStarted = false;
var lettersGuessed = [];
var underScore = "_";
var space = " ";
var html = "";
var startGameStr = "Press Any Key to Begin!";
var youWonStr = "You Won!";
var youLostStr = "You Lost!";
var notLetterStr = "The keypress is not a letter. Try again.";
var repeatedLetterStr = "You already tried the letter: ";
var repeatedLetterSnd = new Audio("./assets/sounds/RepeatedLetter.mp3"); // buffers automatically when created
var correctLetterSnd = new Audio("./assets/sounds/CorrectLetter.mp3"); // buffers automatically when created
var wrongLetterSnd = new Audio("./assets/sounds/WrongLetter.mp3"); // buffers automatically when created
var youWinSnd = new Audio("./assets/sounds/YouWin.mp3"); // buffers automatically when created
var youLostSnd = new Audio("./assets/sounds/YouLost.mp3"); // buffers automatically when created

// initialize the display when the window is loaded
window.onload = function () {
    html = "<P>" + startGameStr + "</p>";
    document.querySelector("#multiPurposeText").innerHTML = html;
}

// get a keypress from the user
document.onkeyup = function (event) {
    // Capture the key press, convert it to lowercase, and save it to a variable.
    letter = String.fromCharCode(event.keyCode).toLowerCase();

    if (gameStarted === false) {
        startGame();
        canvas();
        console.log("Starting New Game");
    } else {
        // clear the multiPurposeText area
        html = "<P>" + "</p>";
        document.querySelector("#multiPurposeText").innerHTML = html;

        // test of keypress is alphabetic
        if ((event.keyCode >= 65) && (event.keyCode <= 90) || 
            (event.keyCode >= 97) && (event.keyCode <= 122)) 
        {
            // the key pressed was alphabetic        
            guessWord();
        } else {
            // the keypress was not alphabetic
            html = "<P>" + notLetterStr + "</p>";
            document.querySelector("#multiPurposeText").innerHTML = html;
        }
    }
    updateWebPage();
    var snd;

    // has the user exhausted guessesRemaining or
    // solved the word?
    if ((solved) || (guessesRemaining === 0)) {
        if (solved) {
            html = "<P>" + youWonStr.toUpperCase() + "</p>";
            html += "<p>" + startGameStr + "</p>";
            document.querySelector("#multiPurposeText").innerHTML = html;

            // play a sound
            youWinSnd.play();
            console.log("you Won");
            // increment wins by 1 and
            winCount++;
        } else { // guessesRemain equals 0
            html = "<P>" + youLostStr.toUpperCase() + "</p>";
            html += "<p>" + startGameStr + "</p>";
            document.querySelector("#multiPurposeText").innerHTML = html;

            //play a sound
            youLostSnd.play();
            console.log("You Lost");
        }
        
        // reset gameStarted to false to start a new game
        gameStarted = false;
    }
}

function startGame() { // initial key press to start the game
        
    guessesRemaining = 10;
    solved = false;
    gameStarted = true;
    lettersGuessed.length = 0;

    // clear the multipurpose text area
    html = "<P>" + "</p>";
    document.querySelector("#multiPurposeText").innerHTML = html;

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

} // end document.onkeyup = function(event) {

function guessWord() {
    var pos = 0;
   
    console.log("You guessed the letter: " + letter);
    
    // if letter has already been used don't count it
    pos = lettersGuessed.indexOf(letter.toLowerCase());
    if (pos !== -1) {
        //play a sound
        repeatedLetterSnd.play();

        html = "<P>" + repeatedLetterStr + letter.toUpperCase() + " ." + "</p>";
        document.querySelector("#guessedLetterRepeated").innerHTML = html;
        console.log("you already tried this letter.");
    } else {
        // add this letter to the letterGuessed array
        lettersGuessed.push(letter.toLowerCase());

        // clear #guessedLetterRepeated
        html = "";
        document.querySelector("#guessedLetterRepeated").innerHTML = html;
        
        // does the letter exist in the hangManWord?
        var indices = [];
        pos = 0;
        while ((pos = hangManWord.toLowerCase().indexOf(letter.toLowerCase(), pos)) !== -1) {
            indices.push(pos);
            pos++;
        }

        // need to check if the letter was already guessed
        
        if (indices.length) {
            console.log("indices = " + indices.toString());
            //play a sound
            correctLetterSnd.play();
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
            //play a sound
            wrongLetterSnd.play();

            console.log("not found");
            // letter was not found, decrement guessesRemaining by 1
            guessesRemaining -= 1;
            animate();
        }
    }
}

function fillString(withChar, length) {
    var myString ="";
   
    for (var i = 0; i < length; i++) {
        myString = myString.concat(withChar);
    }
   
    return myString;
}

// the following code snippet taken from StackOverflow.com
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

function updateWebPage() {
    
    console.log("solvedWord.length: " + solvedWord.length);
    // display the parts of the solved the user guessed so far
    html = "<pre>"; // open tag - need to use <pre>, otherwise white space is collapsed
    for (var i = 0; i < solvedWord.length; i++) {
        if ( i === 0 ) { // first letter of word
            html += solvedWord.charAt(i).toUpperCase() + space;
        } else if (solvedWord.charAt(i) != space) { // letter between first and last in word
            html += solvedWord.charAt(i).toUpperCase() + space;   
        } else { // this is a natural space in the word, add additional space for display
            html += space + solvedWord.charAt(i).toUpperCase();
            console.log("found a space");
        }
    }
    html += "</pre>"; // add closing tag
    document.querySelector("#currentWord").innerHTML = html;
    console.log("html: " + html);

    // update win count
    html = "<p>" + "Wins: " + winCount + "</p>";
    document.querySelector("#winCount").innerHTML = html;

    // update remaining guesses
    html = "<p>" + "Guesses Remaining: " + guessesRemaining + "</p>";
    document.querySelector("#guessesRemaining").innerHTML = html;
    
    // update letters guessed
    html = "<p>" + "Letters Guessed: ";
    if (lettersGuessed.length) {
       html += lettersGuessed.toString().toUpperCase();
    }
    html += "</p>";
    document.querySelector("#lettersGuessed").innerHTML = html;
}

// The following hangman code was taken from CodePen and modified for
// my own use.  Original author is Cathy Dutton. 

// draw hangman
var animate = function () {
    var drawMe = guessesRemaining;
    drawArray[drawMe]();
}

// Hangman
canvas =  function(){
    myStickman = document.getElementById("stickman");
    context = myStickman.getContext('2d');
    context.clearRect(0, 0, 400, 400);
    context.beginPath();
    context.strokeStyle = "#fff";
    context.lineWidth = 2;
};

head = function(){
    myStickman = document.getElementById("stickman");
    context = myStickman.getContext('2d');
    context.beginPath();
    context.arc(60, 25, 10, 0, Math.PI*2, true);
    context.stroke();
}

draw = function($pathFromx, $pathFromy, $pathTox, $pathToy) {
    context.moveTo($pathFromx, $pathFromy);
    context.lineTo($pathTox, $pathToy);
    context.stroke(); 
}

frame1 = function() {
   // draw (0, 150, 150, 150);
    draw (0, 120, 120, 120);
};

frame2 = function() {
   // draw (10, 0, 10, 600);
    draw (10, 0, 10, 120);
};

frame3 = function() {
    draw (0, 5, 70, 5);
};

frame4 = function() {
    draw (60, 5, 60, 15);
};

torso = function() {
    draw (60, 36, 60, 70);
};

rightArm = function() {
    draw (60, 46, 100, 50);
};

leftArm = function() {
    draw (60, 46, 20, 50);
};

rightLeg = function() {
    draw (60, 70, 100, 100);
};

leftLeg = function() {
    draw (60, 70, 20, 100);
};

var drawArray = [rightLeg, leftLeg, rightArm, leftArm,  torso,  head, frame4, frame3, frame2, frame1]; 
    