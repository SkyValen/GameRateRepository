let games = [];
let pages = 0;
let offset = 0;
let upTo = 6;

function getGames() {
    fetch(`/games/all`)
        .then((response) => response.json())
        .then(async (data) => {
            for (let i = 0; i < data.length; i++) {
                let rating = await fetch(`/games/rating?id=${data[i].id}`)
                    .then((response) => response.json())
                    .then((data) => {
                        return data.rating
                    });
                data[i].rating = rating
            }
            games = data
            pages = Math.ceil(games.length / 5)
            console.log(games)
            console.log(pages)
        })
        .finally(() => {
            gamePagination();
        })
}

function gamePagination() {
    let list = document.getElementById("games-list");
    list.innerHTML = "";
    games.slice(offset, upTo).map((item) => {
        console.log(item)
        list.innerHTML += `
        <div class="game-card">
            <a href="#">
                <img src='${item.image}' class="game-img">
            </a>
            <div class="game-info">
                <h2><a href="#">${item.name}</a></h2>
                <p class="rating">${item.rating != undefined ? item.rating : "?"}/10</p>
                <p class="description">${item.description}</p>
            </div>
        </div>
        `
    })
}

getGames();