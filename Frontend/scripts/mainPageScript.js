let games = [];
let tags = [];
let filter = false;
let tagsPagination = {
    exclude: [],
    include: [],
    offset: 0,
    upTo: 6,
    pages: 0,
};
let gamesPagination = {
    offset: 0,
    upTo: 6,
    pages: 0,
};

async function getGamesAndTags() {
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
            tagsPagination.pages = Math.ceil(games.length / 5)
        })
        .finally(() => {
            gamePagination();
        })
}

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
    list.innerHTML = "";
    if (tagsPagination.exclude.length > 0 || tagsPagination.include.length > 0) {
        filter = true;
        let filtered = games;
        if (tagsPagination.exclude.length > 0) {
            filtered = filtered.filter(item => tagsPagination.exclude.every(filter => item.tags.includes(filter)) === false);
        }
        if (tagsPagination.include.length > 0) {
            filtered = filtered.filter(item => tagsPagination.include.every(filter => item.tags.includes(filter)) === true);
        }
        filtered.slice(tagsPagination.offset, tagsPagination.upTo).map((item) => {
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
        return;
    }
    games.slice(gamePagination.offset, gamePagination.upTo).map((item) => {
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

function exclude(e) {
    let value = e.target.value;
    if (tagsPagination.exclude.includes(value)) {
        tagsPagination.exclude = tagsPagination.exclude.filter(item => item !== value)
    } else {
        tagsPagination.exclude.push(value);
    }
    tagsPagination.include = tagsPagination.include.filter(item => item !== value);
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
    gamePagination();
    console.log(`include: ${tagsPagination.include}\nexclude: ${tagsPagination.exclude}`)
}

function applyFilter(e) {
    let value = e.target.value
    tagsPagination.tags.includes(value)
        ? tagsPagination.tags = tagsPagination.tags.filter(item => item !== value)
        : tagsPagination.tags.push(value)
    console.log(tagsPagination.tags)
}

getGamesAndTags();