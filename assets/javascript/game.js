// display requirements
// 1) Press any key to get started!
// 2) Number of Wins
// 3) current word with place holders for each letter in the word: _ _ _ _ _ _
// 4) Number of guesses remaining start at 10
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

// define the lphabit array
var alphabet = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" ];

// RGB settings for Red, White and Blue
var rgbColorRed = "rgb(255, 0, 0)";
var rgbColorWhite = "rgb(255, 255, 255)";
var rgbColorBlue = "rgb(0, 0, 255)";

// initialize some variables for start of game
var winCount = 0;
var solved; // the user guessed the word before exhausting number of guesse
var guessesRemaining;
var hangManWord; // this is the word the user has to guess
var solvedWord = ""; // this string will keep track of what letters the user guessed
var gameStarted = false;
var lettersGuessed = []; // this will keep track of which letters the user has guessed
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
$(document).ready(function () {
    html = "<P>" + startGameStr + "</p>";
    document.querySelector("#multiPurposeText").innerHTML = html;

    for (var i = 0; i < alphabet.length; i++) {
        var elementBtn = $("<button>"); //Equivalent: $(document.createElement('button'))
        elementBtn.addClass("btn btn-primary m-1 button-letter");
        elementBtn.attr("type", "button");
        elementBtn.attr("value", alphabet[i]);
        elementBtn.attr("id", "button-" + alphabet[i]);
        elementBtn.html(alphabet[i]);
        $("#alphbet-buttons").append(elementBtn);
    }

　
    // test if keypress is alphabetic (a - z or A - Z)
    function isKeypressAlphabetic(keyCode) {
        if ((keyCode >= 65) && (keyCode <= 90) ||
        (keyCode >= 97) && (keyCode <= 122)) {
            // the key pressed was alphabetic
            return true;
        }
        return false;
    }

    function processUserInput(letter) {
        var isAlphabetic = false;

        if (gameStarted === false) {
            startGame();
            canvas(); // setup the hangman drawing canvas
            console.log("Starting New Game");
        } else {
            // clear the multiPurposeText area
            html = "<P>" + "</p>";
            document.querySelector("#multiPurposeText").innerHTML = html;
            var keyCode = letter.charCodeAt(0);
            isAlphabetic = isKeypressAlphabetic(keyCode);

            if (isAlphabetic) {
                guessWord(letter);
            } else {
                // the keypress was not alphabetic, warn the user but don't count it against them
                html = "<P>" + notLetterStr + "</p>";
                document.querySelector("#multiPurposeText").innerHTML = html;
            }
        }
        updateWebPage(); // update some the web page elements
    }

    function checkGameStatus() {
        // has the user exhausted guessesRemaining or
        // solved the word?
        if ((solved) || (guessesRemaining === 0)) {
            if (solved) {
                // notify the user they solved the word and prompt them to start a new game
                html = "<P style='color:blue;font-weight: bolder;'>" + youWonStr.toUpperCase() + "</p>";
                html += "<p>" + startGameStr + "</p>";
                document.querySelector("#multiPurposeText").innerHTML = html;

                // play a sound
                youWinSnd.play();
                console.log("you Won");
                // increment wins by 1
                winCount++;
            } else { // since the puzzle was not solved then guessesRemaining must equal 0
                // notify the user that they lost and prompt to start a new game
                html = "<P style='color:red;font-weight:bolder;'>" + youLostStr.toUpperCase() + "</p>";
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

    } // end function startGame()

    function guessWord(letter) {
        var pos = 0;

        console.log("You guessed the letter: " + letter);

        // if letter has already been used don't count it against the user
        pos = lettersGuessed.indexOf(letter.toLowerCase());
        if (pos !== -1) {
            //user has used this letter before
            //play a sound
            repeatedLetterSnd.play();

            html = "<P>" + repeatedLetterStr + letter.toUpperCase() + " ." + "</p>";
            document.querySelector("#multiPurposeText").innerHTML = html;
        } else {
            // add this letter to the lettersGuessed array
            lettersGuessed.push(letter.toLowerCase());

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

                // draw a piece of the hangMan
                drawHangManPart();
            }
        }
    }

    // return string of size length, filled with a the specified character
    function fillString(withChar, length) {
        var myString = "";

        for (var i = 0; i < length; i++) {
            myString = myString.concat(withChar);
        }

        return myString;
    }

    // the following code snippet taken from StackOverflow.com
    // will set the character 'chr' at the specified 'index' in the string 'str'
    // and return string 'str' modified
    function setCharAt(str, index, chr) {
        if (index > str.length - 1) return str;
        return str.substr(0, index) + chr + str.substr(index + 1);
    }

    // update the web page displayed items
    function updateWebPage() {

        console.log("solvedWord.length: " + solvedWord.length);
        // display the parts of the solved word that the user has guessed so far
        html = "<pre>"; // open tag - need to use <pre> tag, otherwise white space is collapsed
        for (var i = 0; i < solvedWord.length; i++) {
            if (i === 0) { // first letter of word
                html += solvedWord.charAt(i).toUpperCase() + space; // append a space after first letter
            } else if (solvedWord.charAt(i) != space) { // letter between first and last letter in word
                html += solvedWord.charAt(i).toUpperCase() + space; // append a space after the letter
            } else { // this is a natural space in the word, add additional space for display
                html += space + solvedWord.charAt(i).toUpperCase();
                console.log("found a space");
            }
        }
        html += "</pre>"; // add closing tag
        document.querySelector("#currentWord").innerHTML = html;
        console.log("html: " + html);

        // update the win count
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

    // get a keypress from the user
    document.onkeyup = function (event) {
        // Capture the key press, convert it to lowercase, and save it to a variable. 
        var letter = String.fromCharCode(event.keyCode).toLowerCase();

        processUserInput(letter);
        checkGameStatus();
    } // end document.onkeyup = function (event)

    $(".button-letter").on("click", function () {
        // get the id of the element that was clicked 
        var id = ($(this).attr("id"));
        var letter = $("#" + id).attr("value");
        console.log("letter = " + letter);

        processUserInput(letter);
        checkGameStatus();
    });

    // The following hangman code was taken from CodePen and modified for
    // my own use.  Original author is Cathy Dutton. 

    // draw hangman part
    var drawHangManPart = function () {
        var drawMe = guessesRemaining;
        drawArray[drawMe]();
    }

    // Hangman canvas
    canvas = function () {
        myStickman = document.getElementById("stickman");
        context = myStickman.getContext('2d');
        context.clearRect(0, 0, 400, 400);
        context.beginPath();
        context.lineWidth = 2;
    }

    head = function () {
        myStickman = document.getElementById("stickman");
        context = myStickman.getContext('2d');
        context.strokeStyle = rgbColorRed;
        context.beginPath();
        context.arc(60, 25, 10, 0, Math.PI * 2, true);
        context.stroke();
    }

    draw = function ($pathFromx, $pathFromy, $pathTox, $pathToy) {
        context.moveTo($pathFromx, $pathFromy);
        context.lineTo($pathTox, $pathToy);
        context.stroke();
    }

    frame1 = function () {
        context = myStickman.getContext('2d');
        context.strokeStyle = rgbColorWhite;
        draw(0, 120, 120, 120);
    };

    frame2 = function () {
        context = myStickman.getContext('2d');
        context.strokeStyle = rgbColorWhite;
        draw(10, 0, 10, 120);
    };

    frame3 = function () {
        context = myStickman.getContext('2d');
        context.strokeStyle = rgbColorWhite;
        draw(0, 5, 70, 5);
    };

    frame4 = function () {
        context = myStickman.getContext('2d');
        context.strokeStyle = rgbColorWhite;
        draw(60, 5, 60, 15);
    };

    torso = function () {
        context = myStickman.getContext('2d');
        context.strokeStyle = rgbColorRed;
        draw(60, 36, 60, 70);
    };

    rightArm = function () {
        context = myStickman.getContext('2d');
        context.strokeStyle = rgbColorRed;
        draw(60, 46, 100, 50);
    };

    leftArm = function () {
        context = myStickman.getContext('2d');
        context.strokeStyle = rgbColorRed;
        draw(60, 46, 20, 50);
    };

    rightLeg = function () {
        context = myStickman.getContext('2d');
        context.strokeStyle = rgbColorRed;
        draw(60, 70, 100, 100);
    };

    leftLeg = function () {
        context = myStickman.getContext('2d');
        context.strokeStyle = rgbColorRed;
        draw(60, 70, 20, 100);
    };

    // hangman parts
    var drawArray = [rightLeg, leftLeg, rightArm, leftArm, torso, head, frame4, frame3, frame2, frame1];

});
