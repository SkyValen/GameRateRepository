let games = [];
let tags = [];
let filter = false;
let tagsPagination = {
    exclude: [],
    include: [],
    offset: 0,
    upTo: 5,
    currentPage: 0,
    pages: 0,
};
let gamesPagination = {
    offset: 0,
    upTo: 5,
    currentPage: 0,
    pages: 0,
};

async function getGamesAndTags() {
    if (document.cookie.trim() === "") {
        window.location.replace("/api/oauth2-redirect");
    }
    // Fetching tags
    fetch(`/tags`)
        .then((response) => response.json())
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                tags.push(data[i])
            }
        })
        .finally(() => {
            renderTags();
        });
    // Fetching games
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
            games = data;
        })
        .finally(() => {
            gamePagination();
        })
}
// Render functions
function renderTags() {
    let list = document.getElementById("tag-list")
    tags.map((item) => {
        list.innerHTML += `
            <div class="tag-switch" value="${item.name}">
                <button onClick="include(event)" value="${item.name}">Include</button>
                <button onClick="exclude(event)" value="${item.name}">Exclude</button>
                <div>${item.name}</div>
            </div>
        `
    })
}

function gamePagination() {
    let list = document.getElementById("games-list");
    let count = document.getElementById("total-count");
    let outOf = document.getElementById("out-of");
    list.innerHTML = "";
    let filtered = games;
    if (tagsPagination.exclude.length > 0 || tagsPagination.include.length > 0) {
        filter = true;
        if (tagsPagination.exclude.length > 0) {
            filtered = filtered.filter(item => tagsPagination.exclude.every(filter => item.tags.includes(filter)) === false);
        }
        if (tagsPagination.include.length > 0) {
            filtered = filtered.filter(item => tagsPagination.include.every(filter => item.tags.includes(filter)) === true);
        }
        filtered.slice(tagsPagination.offset, tagsPagination.upTo).map((item) => {
            list.innerHTML += `
            <div class="game-card">
                <a href="/game?id=${item.id}">
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
        document.getElementById("current-page").value = Math.ceil(tagsPagination.upTo / 5);
        tagsPagination.pages = Math.ceil(filtered.length / 5)
    } else {
        filter = false;
        games.slice(gamesPagination.offset, gamesPagination.upTo).map((item) => {
            list.innerHTML += `
            <div class="game-card">
                <a href="/game?id=${item.id}">
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
        document.getElementById("current-page").value = Math.ceil(gamesPagination.upTo / 5);
        gamesPagination.pages = Math.ceil(games.length / 5)
    }
    count.innerHTML = `${filtered.length} Результатов`;
    outOf.innerHTML = `Из ${Math.ceil(filtered.length / 5)}`
}
// Filter functions
function exclude(e) {
    let value = e.target.value;
    if (tagsPagination.exclude.includes(value)) {
        tagsPagination.exclude = tagsPagination.exclude.filter(item => item !== value)
    } else {
        tagsPagination.exclude.push(value);
    }
    tagsPagination.include = tagsPagination.include.filter(item => item !== value);
    tagsPagination.offset = 0;
    tagsPagination.upTo = 5;
    gamePagination();
    console.log(`include: ${tagsPagination.include}\nexclude: ${tagsPagination.exclude}`)
}

function include(e) {
    let value = e.target.value;
    if (tagsPagination.include.includes(value)) {
        tagsPagination.include = tagsPagination.include.filter(item => item !== value)
    } else {
        tagsPagination.include.push(value);
    }
    tagsPagination.exclude = tagsPagination.exclude.filter(item => item !== value);
    tagsPagination.offset = 0;
    tagsPagination.upTo = 5;
    gamePagination();
    console.log(`include: ${tagsPagination.include}\nexclude: ${tagsPagination.exclude}`)
}
// Pagination functions
function next() {
    if (filter && Math.ceil(tagsPagination.upTo / 5) < tagsPagination.pages) {
        tagsPagination.offset += 5;
        tagsPagination.upTo += 5;
    } else if (!filter && Math.ceil(gamesPagination.upTo / 5) < gamesPagination.pages) {
        gamesPagination.offset += 5;
        gamesPagination.upTo += 5;
    }
    gamePagination();
}
function prev() {
    if (filter && tagsPagination.offset > 0) {
        tagsPagination.offset -= 5;
        tagsPagination.upTo -= 5;
    } else if (!filter && gamesPagination.offset > 0) {
        gamesPagination.offset -= 5;
        gamesPagination.upTo -= 5;
    }
    gamePagination();
}

function choosePage(e) {
    let value = e.target.value;
    if (filter) {
        tagsPagination.offset = (value - 1) * 5;
        tagsPagination.upTo = value * 5;
    } else {
        gamesPagination.offset = (value - 1) * 5;
        gamesPagination.upTo = value * 5;
    }
    gamePagination();
}

getGamesAndTags();