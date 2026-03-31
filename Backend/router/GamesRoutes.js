require("dotenv").config();
const express = require('express');
const router = express.Router();
const PocketBase = require('pocketbase/cjs');
const db = new PocketBase(process.env.DATABASE);

router.get("/all", async (req, res) => {
    const records = await db.collection("game").getFullList();
    let games = [];
    for (let item of records) {
        let game = {
            id: item.id,
            name: item.name,
            description: item.description,
            image: db.files.getURL(item, item.image),
            tags: [],
        };
        const tags = await db.collection("game_tags").getFullList({
            filter: `game_id="${item.id}"`
        })
        for (let item of tags) {
            try {
                let tag = (await db.collection("tags").getOne(item.tag_id)).name
                game.tags.push(`${tag}`)
            } catch (e) {
                console.error(e);
            }
        }
        games.push(game)
    }
    res.json(games);
});

router.get("/rating", async (req, res) => {
    const id = req.query.id;
    const records = await db.collection("review").getFullList({
        filter: `game_id="${id}"`
    });
    let rating = 0;
    records.forEach(element => {
        rating += element.rating;
    });
    rating = rating / records.length;
    res.json({
        rating: rating
    });
})

router.get("/tags", async (req, res) => {
    const id = req.query.id;
    res.json(tags)
})

module.exports = router