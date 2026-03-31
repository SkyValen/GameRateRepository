require("dotenv").config();
const express = require('express');
const router = express.Router();
const PocketBase = require('pocketbase/cjs');
const db = new PocketBase(process.env.DATABASE);

router.get("/all", async (req, res) => {
    const records = await db.collection("game").getFullList();
    const tags = await db.collection("game_tags")
    let games = [];
    records.forEach(item => {
        games.push({
            id: item.id,
            name: item.name,
            description: item.description,
            image: db.files.getURL(item, item.image),
        })
    })
    console.log(games);
    res.json(games);
});

router.get("/rating", async (req, res) => {
    const id = req.query.id;
    const records = await db.collection("review").getFullList({
        filter: `game_id="${id}"`
    });
    console.log(records)
    let rating = 0;
    records.forEach(element => {
        rating += element.rating;
    });
    rating = rating / records.length;
    res.json({
        rating: rating
    });
})

module.exports = router