Foundation.createClass("GamesByEmail.TicTacToeGame",
GamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).
function()
{
   // This is our class contructor.
},
{
    // This will hold our methods and properties.
       checkForDraw:function(board)
   {
      // Use the forEachBoardPoint method which will call the named method 
      //   once for each point on the board, passed as the first parameter, 
      //   other parameters passed too. If the named method returns a value 
      //   that evaluates to true, processing is stopped and that value is 
      //   returned by forEachBoardPoint, else null is returned. 
      return !this.forEachBoardPoint("isMoveLegal",board);
   },
       checkThreeSpaces:function(board,value,x1,y1,x2,y2,x3,y3)
   {
      return (this.valueFromXYBoard(x1,y1,board)==value &&
              this.valueFromXYBoard(x2,y2,board)==value &&
              this.valueFromXYBoard(x3,y3,board)==value);
   },
   checkForWin:function(board,color)
   {
      var value=(color==0 ? 'X' : 'O');
      return (this.checkThreeSpaces(board,value,0,0,1,0,2,0) || // Check horizontals...
              this.checkThreeSpaces(board,value,0,1,1,1,2,1) ||
              this.checkThreeSpaces(board,value,0,2,1,2,2,2) ||
              this.checkThreeSpaces(board,value,0,0,0,1,0,2) || // Check verticals...
              this.checkThreeSpaces(board,value,1,0,1,1,1,2) ||
              this.checkThreeSpaces(board,value,2,0,2,1,2,2) ||
              this.checkThreeSpaces(board,value,0,0,1,1,2,2) || // Check diagonals...
              this.checkThreeSpaces(board,value,0,2,1,1,2,0));
   },
       sendMove:function()
    {
	this.clearMouseEvents();
	var board=this.pieces.getValue();
	var piece=this.pieces.getNewPiece();
	var hiliteIndex=this.valueIndexFromBoardPoint(piece.boardPoint);
	this.info.board=board+hiliteIndex.toString();
	var opponent=this.player.team.nextTeam();
        if (this.checkForWin(board,this.player.team.color))
            this.setEnded(this.player.team);
	else
	    if (this.checkForDraw(board))
        {
            // Our board must be full, the game ended in a draw.
            this.setEnded();
            this.status.draw=true;
            this.status.stalemate=true;
            // Teams tie.
            this.player.team.status.drew=true;
            opponent.status.drew=true;
            // Notify opponent game ended with draw.
            opponent.notify.lost=true;
            opponent.notify.won=true;
        }
        else
            opponent.setExclusiveTurn();
	return Super.sendMove();
    },
       mouseUp:function(screenPoint)
   {
      // First, undo a move if we have already made one.
      if (this.madeMove)
         this.undo();
      // Then get the new piece.
      var piece=this.pieces.getNewPiece();
      // Next, get the board point from the screen point.
      var boardPoint=this.boardPointFromScreenPoint(screenPoint);
      // Now test to see if the move is legal. Move to the board point if it is.
      if (this.checkMove(boardPoint))
       {
	   this.clearHilites();
           piece.setValue(this.player.team.color==0 ? 'X' : 'O');
           piece.move(boardPoint,false);
           // Set the madeMove flag to true...
           this.madeMove=true;
           // ...and that the move is ready to send...
           this.readyToSend=true;
           // ...then update the game controls.
           this.update();
       }
   },
       isMoveLegal:function(toPoint,boardValue)
   {
      // A legal move for Tic-Tac-Toe is any square where there is no piece.
      // First, get the value index for the board point (square) we are testing.
      var valueIndex=this.valueIndexFromBoardPoint(toPoint);
      // Then return true if the value at that index is a space (and the move legal), or false if not.
      return (boardValue.charAt(valueIndex)==' ');
   },
   checkMove:function(toPoint)
   {
      // Get the board state value and pass it to isMoveLegal.
      return this.isMoveLegal(toPoint,this.pieces.getValue());
   },
       mouseOut:function(screenPoint)
   {
      // First get the new piece.
      var piece=this.pieces.getNewPiece();
      // Reset the piece.
      piece.reset();
   },
       mouseMove:function(screenPoint)
   {
      // First get the new piece we are adding.
      var piece=this.pieces.getNewPiece();
      // Set it as an X or O, depending on the 'color' of the team we are playing.
      piece.setValue(this.player.team.color==0 ? 'X' : 'O');
       // Center the piece on the cursor.
             // First, get the board point from the screen point.
      var boardPoint=this.boardPointFromScreenPoint(screenPoint);
      // Now test to see if the move is legal. Snap to the board point if it is, else center on the cursor.
      if (this.checkMove(boardPoint))
         piece.snap(boardPoint);
      else
	  piece.center(screenPoint);
   },
   itsYourTurnHtml:function(resourceName)
   {
      // Make sure to only hook movement if we have not placed a piece yet.
      if (!this.madeMove)
      {
          this.onMouseMove="mouseMove"; // Have our mouseMove method called when the mouse is over the board.
	  this.onMouseOut="mouseOut"; // Have our mouseOut method called when the mouse leaves the board.
      }
       this.onLeftMouseUp="mouseUp"; // Have our mouseUp method called when a mouse button is released over the board.
      return Super.itsYourTurnHtml(resourceName); // Call the parent class' itsYourTurnHtml method.
   },
       synch:function()
    {
	Super.synch(); // Call the parent class' synch method to do whatever it does.
        if (this.info.board.length>9)
	{
            var hiliteIndex=parseInt(this.info.board.charAt(9));
            var hilitePoint=this.boardPointFromValueIndex(hiliteIndex);
            var hiliteHtml=this.hiliteImageHtml(hilitePoint,this.board.pieceRects.hilite);
            this.setOverlayHtml(hiliteHtml);
	}
	else
            this.setOverlayHtml("");
	this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.
    },
       initialize:function(numPlayers,turnTeamIndex)
   {
      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class' initialize method to create the teams and players.
      // Instead of starting with an empty board, for testing 
      // purposes we will start with an O in the middle space.
      this.info.board="         "; // Set info.board to a string of 9 spaces to represent an empty board.
   }
},
{
   // This will hold our static methods and properties.

   // the resourcePack is a collection of information
   // used throughout the class.
   resourcePack:{
      gameFolder:"TicTacToe", // The folder we are in.
      gameTypes:[24], // The types of games supported by this class.
      gameTypeTitles:["Tic-Tac-Toe"], // The titles of games supported by this class.
       allowedNumPlayers:[2], // A list of the number of players allowed in a game.
       teamTitles:["X","O"],
       teamFontColors:["#770802","#008806"],
      itIsYourTurnToMove:"<p>It is your turn to move. Place a piece to make any %rlegal move</a>. After you move you will have the option of sending or undoing the move.", // Change the default prompt.
      board:{  // Various information about our game board.
             image:{  // Information about the board image.
                    src:"Board.gif",  // The path and name of the image file, relative to the Default folder.
                    size:new Foundation.Point(255,255)  // The width and height of the board image, in pixels.
                   },
             border:new Foundation.Point(0,0),  // The size of any left and top border going around the board, in pixels.
             squareSize:new Foundation.Point(85,85),  // The width and height of each square in the board image, in pixels.
             size:new Foundation.Point(3,3),  // The number of squares that make up the board, horizontally and vertically.
             pieceImage:"Pieces.gif", // To be filled in later.
             pieceRects:{ // Clipping rectangles for the pieces.
                         X:new Foundation.Rectangle(0,0,85,85),
                         O:new Foundation.Rectangle(85,0,85,85),
                         hilite:new Foundation.Rectangle(170,0,85,85)
                        }
 // To be filled in later.
      },
       // rules:Foundation.readTextFile("Rules.htm"),
       theVeryLastResource:"" // Insert new resources above here. 
   }
});
