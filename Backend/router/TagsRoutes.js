require("dotenv").config();
const express = require('express');
const router = express.Router();
const PocketBase = require('pocketbase/cjs');
const db = new PocketBase(process.env.DATABASE);

router.get("/", async (req, res) => {
    const records = await db.collection("tags").getFullList();
    let tags = [];
    records.forEach(item => {
        tags.push({
            id: item.id,
            name: item.name
        })
    });
    res.json(tags)
})

module.exports = router