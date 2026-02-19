const board = document.getElementById("boardID");
const squareDimensions = 4;
const rows = [...board.children];
const squaresArray = [];
const piecesArray = [];

for (let i = 1; i <= squareDimensions; i++) {
	rows.forEach((boardChildren) => {
		const squaresInit = document.createElement("div");
		squaresInit.style = "border-color: white; width: 128px; height: 128px; border-style: solid; background-color: black; display: flex; justify-content: center; align-items: center;";
		boardChildren.appendChild(squaresInit);
		squaresArray.push(squaresInit);
	});
}

let peAmount = 4;
let ayinAmount = 4;
let turn = 1;
let selectedSquare = null;
let gamePhase = "placement";

function checkForWinner() {
    const winLines = [
        [0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15],
        [0,4,8,12],[1,5,9,13],[2,6,10,14],[3,7,11,15],
        [0,5,10,15],[3,6,9,12]
    ];
    
    for (const line of winLines) {
        const squares = line.map(i => squaresArray[i]);
        
        if (!squares.every(sq => sq.hasChildNodes())) continue;
        
        const firstPiece = squares[0].firstChild;
        const isPe = firstPiece.src.includes("pe.png");
        
        if (squares.every(sq => 
            sq.firstChild.src.includes("pe.png") === isPe
        )) {
            console.log(`${isPe ? "PE" : "AYIN"} WINS!`);
            return true;
        }
    }
    return false;
}

function getSquareIndex(square) {
    return squaresArray.indexOf(square);
}

function isOneSquareAway(fromIndex, toIndex) {
    const fromRow = Math.floor(fromIndex / 4);
    const fromCol = fromIndex % 4;
    const toRow = Math.floor(toIndex / 4);
    const toCol = toIndex % 4;
    
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    
    return (rowDiff <= 1 && colDiff <= 1) && !(rowDiff === 0 && colDiff === 0);
}

function handlePlacementPhase(clickedSquare) {
	if (clickedSquare.hasChildNodes()) return;
	
	const pieceInit = document.createElement("img");
	pieceInit.style = "width: 80%; transform: rotate(-45deg);";
	
	if (turn === 1 && peAmount > 0) {
		pieceInit.src = "assets/pe.png";
		clickedSquare.appendChild(pieceInit);
		piecesArray.push(pieceInit);
		peAmount -= 1;
		turn = 0;
	} else if (turn === 0 && ayinAmount > 0) {
		pieceInit.src = "assets/ayin.png";
		clickedSquare.appendChild(pieceInit);
		piecesArray.push(pieceInit);
		ayinAmount -= 1;
		turn = 1;
	}
	
	if (peAmount === 0 && ayinAmount === 0) {
		gamePhase = "movement";
	}
	
	checkForWinner();
}

function handleMovementPhase(clickedSquare) {
	if (selectedSquare === null) {
		if (clickedSquare.hasChildNodes()) {
			const piece = clickedSquare.firstChild;
			const isPePiece = piece.src.includes("pe.png");
			
			if ((isPePiece && turn === 1) || (!isPePiece && turn === 0)) {
				selectedSquare = clickedSquare;
			}
		}
	} else {
		if (!clickedSquare.hasChildNodes()) {
			const fromIndex = getSquareIndex(selectedSquare);
			const toIndex = getSquareIndex(clickedSquare);
			
			if (isOneSquareAway(fromIndex, toIndex)) {
				const piece = selectedSquare.firstChild;
				clickedSquare.appendChild(piece);
				turn = turn === 1 ? 0 : 1;
				checkForWinner();
			}
		}
		
		selectedSquare = null;
	}
}

squaresArray.forEach((square) => {
	square.onclick = function() {
		if (gamePhase === "placement") {
			handlePlacementPhase(square);
		} else if (gamePhase === "movement") {
			handleMovementPhase(square);
		}
	};
});
