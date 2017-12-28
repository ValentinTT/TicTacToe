$(document).ready(function() {
    //Initial questions of player and opponent
    $('.players').on('click', function() { //Select X or O
        $('.players').unbind('click'); //Delete listeners
        player = $(this).text().trim();
        opponentAvatar = player === "X" ? "O" : "X";
        $('.options').fadeOut(function() { //Erase buttons
            //Add Opponent buttons with and animation
            let chooseOpponent = '<a css="display:none" class="options opponent"><span class="options-span"><i class="fas fa-desktop"></i></span></a><a css="display:none" class="options"><span>Vs</span></a><a css="display:none" class="options opponent"><span class="options-span"><i class="fas fa-user"></i></span></a>';
            $('.board').html(chooseOpponent);
            $('.options').fadeIn();

            $('.opponent').on('click', function() { //Select pc or human
                $('.options').unbind('click'); //Delete listeners
                if ($(this).html().includes("fa-desktop"))
                    opponent = "pc";
                else
                    opponent = "user";
                //Delete buttons and message with an animation
                $('.options').fadeOut();
                $('.message').animate({
                    fontSize: 0
                }, function() {
                    startGame();
                });
            });
        });
        //Change text message from choose player to choose opponent with an animation
        $('.message').animate({
            fontSize: 0
        }, function() {
            $('.message').html("Choose an Opponent");
            $('.message').animate({
                fontSize: "30px"
            });
        })
    });
});

var markWinnerColor = "#000";
var player = "";
var opponent = "";
var opponentAvatar = "";
var isPlayerTurn = true;
var board = [
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"]
];

/*
 *Check if there is still empty cells ("-") in the board
 */
function isBoardFull(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === "-") return false;
        }
    }
    return true;
}

/*
 *This function return true if there is a winner not matter who it is
 */
function gameOver(board) {
    for (let i = 0; i < 3; i++) {
        //Three in a row
        if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] != "-")
            return true;
        //Three in a column
        else if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] != "-")
            return true;
    }
    //Three crossed
    if (board[1][1] === "-") //If the center is empty It's impposible to have a three crossed
        return false;
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] ||
        board[0][2] === board[1][1] && board[1][1] === board[2][0])
        return true;
    return false;
}

/*
 *This function return the winner X or O or - if there is no winner
 */
function whoWon(board) {
    for (let i = 0; i < 3; i++) {
        //Three in a row
        if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] != "-") {
            return board[i][0];
        }
        //Three in a column
        else if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] != "-") {
            return board[0][i];
        }
    }
    //Three crossed
    if (board[1][1] === "-") //If the center is empty It's impposible to have a three crossed
        return "-";
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] ||
        board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return board[1][1];
    }
    return "-";
}

/*
 *This function mark in the board the position pass by index(0-8) of the player (X-0)
 */
function markBoard(board, index, player) {
    switch (index) {
        case 0:
        case 1:
        case 2:
            board[0][index] = player;
            break;
        case 3:
        case 4:
        case 5:
            board[1][index - 3] = player;
            break;
        case 6:
        case 7:
        case 8:
            board[2][index - 6] = player;
            break;
        default:
            break;
    }
}


/*
 *The AI is defined as the Maximizer
 *This function evaluate all the possible options the game
 *can goes through and make the best move
 */
function miniMax(board, depth, isMax) {
    let boardResult = whoWon(board);
    if (player === boardResult) return -10; //Minimizer won Player
    if (opponentAvatar === boardResult) return 10; //Maximizer won Pc 
    if (isBoardFull(board)) return 0; //Tie

    //Maximizer moves
    if (isMax) {
        let best = -1000;
        //Iterate through the board trying to find a blank cell
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === "-") {
                    //Make the movement
                    board[i][j] = opponentAvatar;
                    //Recursive call to miniMax
                    best = Math.max(best, miniMax(board, depth + 1, !isMax));
                    //Undo the movement
                    board[i][j] = "-";
                }
            }
        }
        return best;
    }
    //Minimizer moves
    let best = 1000;
    //Iterate through the board trying to find a blank cell
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === "-") {
                //Make the movement
                board[i][j] = player;
                //Recursive call to miniMax
                best = Math.min(best, miniMax(board, depth + 1, !isMax));
                //Undo the movement
                board[i][j] = "-";
            }
        }
    }
    aux++;
    return best;
}
var aux = 0;

/*
 *This function find the best move to do in the actual position
 *of the board. This consider that the move must be done by the
 *Maximizer(pc) not the human
 */
function findBestMove(board) {
    let bestVal = -1000; //The maximizer always try to reach the highest score
    let bestMove = [-1, -1];

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            //Try to find a blank cell
            if (board[i][j] === "-") {
                //Make the movement
                board[i][j] = opponentAvatar;
                let moveVal = miniMax(board, 0, false);
                console.log("i: ", i, " j, ", j, "moveVal", moveVal);
                //Undo the movement
                board[i][j] = "-";
                //if the actual movement is a better play
                if (moveVal > bestVal) {
                    bestMove = [i, j];
                    bestVal = moveVal;
                }
            }
        }
    }
    return bestMove;

}

function makeComputerMove() {
    let move = findBestMove(board);
    console.log("Minimax: ", aux);
    aux = 0;
    /*Transform the move[row, column] to a number 1-9 to change the correct .cell in the html */
    let moveIndex = move[0] * 3 + move[1] + 1;
    console.log(move);
    $('.board .cell:nth-child(' + moveIndex + ")").html("<span>" + opponentAvatar + "</span>");
    $('.board .cell:nth-child(' + moveIndex + ")").removeClass('empty');
    /*Mark board hopes an index 0-8 and moveIndex is 
    calculated thincking in the nth-child() which starts at 1*/
    markBoard(board, moveIndex - 1, opponentAvatar);

    if (gameOver(board)) { //If there is a winner it is computer
        console.log("Computer wind Game over!!!");
        drawWinner(board); //Change the color of the winning row/column/cross
        //animated message
        $('.message').html("Computer Won!!!");
        $('.message').animate({
            fontSize: "30px"
        }, function() {
            let id = setInterval(function() {
                clearInterval(id);
                $('.message').animate({
                    fontSize: 0
                }, function() { //After message's gone start a new game
                    startGame();
                })
            }, 2000);
        });
        return;
    } else if (isBoardFull(board)) { //If there is a tie
        //animated message
        $('.message').html("It's a tie!!!");
        $('.message').animate({
            fontSize: "30px"
        }, function() {
            let id = setInterval(function() {
                clearInterval(id);
                $('.message').animate({
                    fontSize: 0
                }, function() { //After message's gone start a new game
                    startGame();
                })
            }, 2000);
        });
        return;
    }

    isPlayerTurn = true; //Now is player turn
    //Add cell's animations for the player
    if (player === 'O')
        $('.empty').addClass('turn-O');
    else
        $('.empty').addClass('turn-X');
    addCellListenerForPlayer();
}


function addCellListenerForPlayer() {
    $('.empty').on('click', function() {
        console.log("PLAYER LISTENER", isPlayerTurn);
        if (!isPlayerTurn) return; //Only available when is player turn

        isPlayerTurn = false; //OpponentTurn
        $('.empty').unbind('click'); //Delete cells' listeners
        //Remove the animation class
        if (player === "X") {
            $('.empty').removeClass("turn-X");
            $(this).html("<span>X</span>");
        } else {
            $('.empty').removeClass("turn-O");
            $(this).html("<span>O</span>");
        }
        $(this).removeClass("empty"); //Know the cell is not empty any more.

        //Mark cell selected in the board
        let cellSelected = $('.cell').index($(this));
        markBoard(board, cellSelected, player);

        if (gameOver(board)) {
            console.log("You win!!");
            $('.cell').unbind('click'); //Make board unclickable
            drawWinner(board);
            let msg;
            if (opponent == "pc")
                msg = "YOU Won!!!";
            else
                msg = "Player 1 Won!!!";

            //Animated message
            $('.message').html(msg);
            $('.message').animate({
                fontSize: "30px"
            }, function() {
                let id = setInterval(function() {
                    clearInterval(id);
                    $('.message').animate({
                        fontSize: 0
                    }, function() { //Start a new game after message vanished
                        startGame();
                    })
                }, 2000);
            });
            return;
        } else if (isBoardFull(board)) {
            //Animated message
            $('.message').html("It's a tie!!!");
            $('.message').animate({
                fontSize: "30px"
            }, function() {
                let id = setInterval(function() {
                    clearInterval(id);
                    $('.message').animate({
                        fontSize: 0
                    }, function() { //Start a new game after message vanished
                        startGame();
                    })
                }, 2000);
            });
            return;
        }

        //Produce opponent's move
        if (opponent === "pc") {
            //TODO: Crear AI
            makeComputerMove();
        } else {
            //Add cells' animation for the opponent
            if (player === 'X')
                $('.empty').addClass('turn-O');
            else
                $('.empty').addClass('turn-X');
            addCellListenerForOpponent();
        }
    });
}

function addCellListenerForOpponent() {
    $('.empty').on('click', function() {
        if (isPlayerTurn) return; //Only available when is player turn

        isPlayerTurn = true; //Is players turn now
        $('.empty').unbind('click'); //Delete cells' listeners
        //Remove the animation class
        if (player === "O") {
            $('.empty').removeClass("turn-X");
            $(this).html("<span>X</span>");
        } else {
            $('.empty').removeClass("turn-O");
            $(this).html("<span>O</span>");
        }
        $(this).removeClass("empty");

        //Mark cell selected in the board
        let cellSelected = $('.cell').index($(this));
        markBoard(board, cellSelected, opponentAvatar);

        if (gameOver(board)) {
            console.log("Opponent wind Game over!!!");
            $('.cell').unbind('click');
            drawWinner(board);
            //Animated message
            $('.message').html("Player 2 Won!!!");
            $('.message').animate({
                fontSize: "30px"
            }, function() {
                let id = setInterval(function() {
                    clearInterval(id);
                    $('.message').animate({
                        fontSize: 0
                    }, function() { //Start a new game after message vanished
                        startGame();
                    })
                }, 2000);
            });
            return;
        }

        //Add cell's animations for the player
        if (player === 'O')
            $('.empty').addClass('turn-O');
        else
            $('.empty').addClass('turn-X');
        addCellListenerForPlayer();
    });
}

function drawWinner(board) {
    for (let i = 0; i < 3; i++) {
        //Three in a row
        if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] != "-") {
            $('.board .cell:nth-child(' + ((i * 3) + 1) + ")").css("color", markWinnerColor);
            $('.board .cell:nth-child(' + ((i * 3) + 2) + ")").css("color", markWinnerColor);
            $('.board .cell:nth-child(' + ((i * 3) + 3) + ")").css("color", markWinnerColor);
        }
        //Three in a column
        else if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] != "-") {
            $('.board .cell:nth-child(' + (1 + i) + ")").css("color", markWinnerColor);
            $('.board .cell:nth-child(' + (4 + i) + ")").css("color", markWinnerColor);
            $('.board .cell:nth-child(' + (7 + i) + ")").css("color", markWinnerColor);
        }
    }
    //Three crossed
    if (board[1][1] === "-") //If the center is empty It's impposible to have a three crossed
        return;

    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        $('.board .cell:nth-child(' + 1 + ")").css("color", markWinnerColor);
        $('.board .cell:nth-child(' + 5 + ")").css("color", markWinnerColor);
        $('.board .cell:nth-child(' + 9 + ")").css("color", markWinnerColor);
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        $('.board .cell:nth-child(' + 3 + ")").css("color", markWinnerColor);
        $('.board .cell:nth-child(' + 5 + ")").css("color", markWinnerColor);
        $('.board .cell:nth-child(' + 7 + ")").css("color", markWinnerColor);
    }
}
//Create the 9 cells for the game with the correct animations
function startGame() {
    isPlayerTurn = true;
    board = [
        ["-", "-", "-"],
        ["-", "-", "-"],
        ["-", "-", "-"]
    ];
    $('.cell').fadeOut();
    //Add game cells (9) with an animation
    let cells = '<a style="display: none;" class="cell empty"><span></span></a><a style="display: none;" class="cell empty"><span></span></a><a style="display: none;" class="cell empty"><span></span></a><a style="display: none;" class="cell empty"><span></span></a><a style="display: none;" class="cell empty"><span></span></a><a style="display: none;" class="cell empty"><span></span></a><a style="display: none;" class="cell empty"><span></span></a><a style="display: none;" class="cell empty"><span></span></a><a style="display: none;" class="cell empty"><span></span></a>';
    $('.board').html(cells);
    $('.cell').fadeIn();
    //Add rotateY animation acording to players election (X right and O left)
    if (player === 'X')
        $('.empty').addClass('turn-X');
    else
        $('.empty').addClass('turn-O');
    addCellListenerForPlayer();
}