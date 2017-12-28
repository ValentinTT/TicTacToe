$(document).ready(function() {
    var markWinnerColor = "#000";
    var player = "";
    var opponent = "";
    var isPlayerTurn = true;
    var board = [
        ["-", "-", "-"],
        ["-", "-", "-"],
        ["-", "-", "-"]
    ];

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
                console.log("Game over!!!");
                $('.cell').unbind('click');
                drawWinner(board);
                let msg;
                if (opponent == "pc")
                    msg = "YOU Won!!!";
                else
                    msg = "Player 1 Won!!!";

                $('.message').html(msg);
                $('.message').animate({
                    fontSize: "30px"
                }, function() {
                    let id = setInterval(function() {
                        clearInterval(id);
                        $('.message').animate({
                            fontSize: 0
                        }, function() {
                            startGame();
                        })
                    }, 2000);
                });
                return;
            }

            //Produce opponent's move
            if (opponent === "pc") {
                //TODO: Crear AI
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
            markBoard(board, cellSelected, player === "X" ? "O" : "X");

            if (gameOver(board)) {
                console.log("Opponent wind Game over!!!");
                $('.cell').unbind('click');
                drawWinner(board);

                $('.message').html("Player 2 Won!!!");
                $('.message').animate({
                    fontSize: "30px"
                }, function() {
                    let id = setInterval(function() {
                        clearInterval(id);
                        $('.message').animate({
                            fontSize: 0
                        }, function() {
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
    //Initial questions of player and opponent
    $('.players').on('click', function() { //Select X or O
        $('.players').unbind('click'); //Delete listeners
        player = $(this).text().trim();
        $('.options').fadeOut(function() { //Erase buttons
            //Add Opponent buttons with and animation
            let chooseOpponent = '<a href="#" css="display:none" class="options opponent"><span class="options-span"><i class="fas fa-desktop"></i></span></a><a href="#" css="display:none" class="options"><span>Vs</span></a><a href="#" css="display:none" class="options opponent"><span class="options-span"><i class="fas fa-user"></i></span></a>';
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
        let cells = '<a href="#" style="display: none;" class="cell empty"><span></span></a><a href="#" style="display: none;" class="cell empty"><span></span></a><a href="#" style="display: none;" class="cell empty"><span></span></a><a href="#" style="display: none;" class="cell empty"><span></span></a><a href="#" style="display: none;" class="cell empty"><span></span></a><a href="#" style="display: none;" class="cell empty"><span></span></a><a href="#" style="display: none;" class="cell empty"><span></span></a><a href="#" style="display: none;" class="cell empty"><span></span></a><a href="#" style="display: none;" class="cell empty"><span></span></a>';
        $('.board').html(cells);
        $('.cell').fadeIn();
        //Add rotateY animation acording to players election (X right and O left)
        if (player === 'X')
            $('.empty').addClass('turn-X');
        else
            $('.empty').addClass('turn-O');
        addCellListenerForPlayer();
    }
});


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