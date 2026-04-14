// get id from url
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('id');

// get game info
async function renderGame() {
    let game = await fetch(`/games/game?id=${gameId}`)
        .then(response => response.json())
        .then(async (data) => {
            console.log(data)
            let comments = await fetch("/games/game/comments?id=" + gameId)
                .then(response => response.json())
                .then(comments => {
                    console.log("Комментарии игры:", comments);
                    return comments
                });
            comments.map(async (comment) => {
                let user = await fetch("/users/user?id=" + comment.userId)
                    .then(response => response.json())
                    .then(user => {
                        return user;
                    });
                console.log("Пользователь комментария:", user.color);
            })

            data.comments = comments;
            console.log(data)
            return data;
        })
        .catch(error => {
            console.error("Ошибка при загрузке данных игры:", error);
            return null;
        });
    if (game) {
        document.title = `${game.title} - GamesRate`;
        document.getElementById('game-title').innerText = game.name;
        document.getElementById('game-description').innerText = game.description;
        document.getElementById('game-image').src = game.image;
        document.getElementById('game-rating').innerText = calculateRating(game.comments);

        // Отрисовка тегов игры
        // const tagsContainer = document.getElementById('game-tags');
        // tagsContainer.innerHTML = game.tags.map(tag => `<li>${tag}</li>`).join('');

        // Отрисовка комментариев
        const commentsContainer = document.getElementById('comments-container');
        if (game.comments.length > 0) {
            //const user = usersData.find(u => u.id === comment.userId);
            for (let i = 0; i < game.comments.length; i++) {
                console.log(game.comments[i])
                let comment = game.comments[i];
                commentsContainer.innerHTML += `
                <div class="comment-card">
                    <div class="comment-user-info">
                        <span class="username">${user ? user.name : 'Аноним'}</span>
                        <span class="comment-date">(Рейтинг: ${comment.userRating}/10)</span>
                    </div>
                    <div class="comment-body">
                        <div class="comment-avatar"></div>
                        <p class="comment-text">${comment.text}</p>
                    </div>
                </div>
            `;
            }
        } else {
            commentsContainer.innerHTML = '<p>Комментариев пока нет. Будьте первым!</p>';
        }
    } else {
        // Если игра не найдена
        document.querySelector('.content').innerHTML = '<h1>Игра не найдена</h1><a href="/">Вернуться на главную</a>';
    }
}

// 3. Функция расчета рейтинга (такая же, как на главной)
function calculateRating(comments) {
    if (!comments || comments.length === 0) return "?/10";
    const total = comments.reduce((acc, c) => acc + c.userRating, 0);
    return `${(total / comments.length).toFixed(1)}/10`;
}

function createCommentHTML(comment) {
    const user = usersData.find(u => u.id === comment.userId);
    return `
        <div class="comment-card">
            <div class="comment-user-info">
                <span class="username">${user ? user.name : 'Аноним'}</span>
                <span class="comment-date">(Рейтинг: ${comment.userRating}/10)</span>
            </div>
            <div class="comment-body">
                <img src="${user ? user.avatar : 'default-avatar.png'}" class="comment-avatar">
                <p class="comment-text">${comment.text}</p>
            </div>
        </div>
    `;
}

// ЛОГИКА ДОБАВЛЕНИЯ КОММЕНТАРИЯ
// if (game) {
//     const submitBtn = document.querySelector('.submit-btn');
//     const commentInput = document.querySelector('.comment-input');
//     const ratingInput = document.querySelector('.rating-selector input');
//     const commentsContainer = document.getElementById('comments-container');

//     submitBtn.addEventListener('click', () => {
//         const text = commentInput.value.trim();
//         const rating = parseInt(ratingInput.value);

//         // Простая проверка: не отправлять пустой текст
//         if (text === "") {
//             alert("Сначала напиши что-нибудь!");
//             return;
//         }

//         // Создаем объект нового комментария
//         const newComment = {
//             userId: 1, // Фиксированный ID по твоему запросу
//             userRating: rating,
//             text: text
//         };

//         // 1. Добавляем в массив данных (чтобы рейтинг пересчитался)
//         game.comments.push(newComment);

//         // 2. Обновляем визуальный рейтинг игры на странице
//         const gameRatingElement = document.getElementById('game-rating');
//         // Функция calculateRating должна быть доступна здесь
//         gameRatingElement.innerText = calculateRating(game.comments);

//         // 3. Добавляем новый комментарий в начало или конец списка
//         // Если до этого была надпись "Комментариев нет", очищаем контейнер
//         if (game.comments.length === 1) {
//             commentsContainer.innerHTML = '';
//         }

//         commentsContainer.innerHTML += createCommentHTML(newComment);

//         // 4. Очищаем поля ввода
//         commentInput.value = "";
//         ratingInput.value = "10";

//         console.log("Комментарий добавлен!", game.comments);
//     });
// }

renderGame();