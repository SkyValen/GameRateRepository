const express = require('express');
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const gameRoutes = require('./router/GamesRoutes');

app.use(express.static(path.join(__dirname, "..", "Frontend")))
app.use(express.static(path.join(__dirname, "..", "Frontend", "scripts")))
app.use("/games", gameRoutes);

app.get("/", async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, "..", "Frontend", "mainPage", "mainPage.html"))
    } catch (e) {
        res.status(500).json({ error: e.message });
        console.error(e);
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});