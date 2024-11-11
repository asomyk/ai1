let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

document.getElementById("getLocation").addEventListener("click", function(event) {
    if (!navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);
        let userMarker = L.marker([lat, lon]).addTo(map);
        userMarker.bindPopup(`Twoja lokalizacja: ${lat}, ${lon}`).openPopup();
    }, positionError => {
        console.error(positionError);
    });
});

if (Notification.permission === 'default') {
    Notification.requestPermission().then(function(result) {
        if (result === 'granted') {
            new Notification("Powiadomienia zostały włączone!");
        }
    });
}

const saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", () => {
    leafletImage(map, (error, canvas) => {
        const rasterMap = document.getElementById("rasterMap");
        const context = rasterMap.getContext("2d");
        context.drawImage(canvas, 0, 0, 300, 150);

        const pieceWidth = canvas.width / 4;
        const pieceHeight = canvas.height / 4;

        const piecesArray = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const piece = document.createElement("canvas");
                piece.width = pieceWidth;
                piece.height = pieceHeight;
                const pieceContext = piece.getContext("2d");

                pieceContext.drawImage(
                    canvas,
                    col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight,
                    0, 0, pieceWidth, pieceHeight
                );

                piece.dataset.position = `${col}-${row}`;
                piece.id = `piece-${col}-${row}`;
                piece.draggable = true;

                piece.addEventListener("dragstart", handleDragStart);
                piecesArray.push(piece);
            }
        }

        const shuffledPieces = piecesArray.sort(() => Math.random() - 0.5);
        const tableContainer = document.getElementById("table");
        tableContainer.innerHTML = "";

        shuffledPieces.forEach((piece) => {
            tableContainer.appendChild(piece);
        });
    });
});

function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
}

const puzzleArea = document.getElementById("puzzleArea");

puzzleArea.addEventListener("dragover", (e) => {
    e.preventDefault();
});

puzzleArea.addEventListener("drop", (e) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData("text/plain");
    const piece = document.getElementById(pieceId);

    const targetPosition = piece.dataset.position;
    const currentDropIndex = Array.from(puzzleArea.children).length;
    const posX = currentDropIndex % 4;
    const posY = Math.floor(currentDropIndex / 4);
    const calculatedPosition = `${posX}-${posY}`;

    if (targetPosition === calculatedPosition) {
        piece.classList.add("correct");
        piece.draggable = false;
        puzzleArea.appendChild(piece);
        checkPuzzleCompletion();
    } else {
        alert("Złe miejsce, musisz układać obrazek po kolei!");
        table.appendChild(piece);
    }
});

function checkPuzzleCompletion() {
    let correctPieces = document.querySelectorAll('.correct');
    if (correctPieces.length === 16) {
        // Usuwamy console.log i dodajemy Notification API
        if (Notification.permission === 'granted') {
            new Notification("Gratulacje~! Puzzle ułożone~!!");
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification("Gratulacje~! Puzzle ułożone~~!!");
                } else {
                    alert("Gratulacje~! Puzzle ułożone~~!!");
                }
            });
        } else {
            alert("Gratulacje~! Puzzle ułożone~~!!");
        }
    }
}

const table = document.getElementById("table");

table.addEventListener("dragover", (e) => {
    e.preventDefault();
});

table.addEventListener("drop", (e) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData("text/plain");
    const piece = document.getElementById(pieceId);

    table.appendChild(piece);
    piece.classList.remove("correct");
    piece.draggable = true;
});
