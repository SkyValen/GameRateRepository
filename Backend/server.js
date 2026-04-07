//Import Section
const cors = require("cors")
const express = require('express');
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

//Routes Section
const gameRoutes = require('./router/GamesRoutes');
const tagsRoutes = require('./router/TagsRoutes');
const userRoutes = require('./router/UserRoutes');

//App use section
app.use(cors());
app.use(express.static(path.resolve(__dirname, "../Frontend")))
app.use(express.static(path.resolve(__dirname, "../Frontend/scripts")))
app.use("/games", gameRoutes);
app.use("/tags", tagsRoutes);
app.use("/users", userRoutes);

// Design render section
app.get("/", async (req, res) => {
    try {
        res.sendFile(path.resolve(__dirname, "../Frontend/mainPage/mainPage.html"))
    } catch (e) {
        res.status(500).json({ error: e.message });
        console.error(e);
    }
});

app.get("/game", async (req, res) => {
    try {
        res.sendFile(path.resolve(__dirname, "../Frontend/gamePage/gamePage.html"))
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
})

// Listener
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});