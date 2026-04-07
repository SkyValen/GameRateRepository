require("dotenv").config();
const express = require('express');
const router = express.Router();
const PocketBase = require('pocketbase/cjs');
const db = new PocketBase(process.env.DATABASE);

router.get("/user", async (req, res) => {
    const record = await db.collection("users").getOne(req.query.id);
    let user = {
        id: record.id,
        color: record.color,
    }
    res.json(user);
});


module.exports = router