require("dotenv").config();
const express = require('express');
const router = express.Router();
const PocketBase = require('pocketbase/cjs');
const db = new PocketBase(process.env.DATABASE);

// Получить существующего пользователя
router.get("/user", async (req, res) => {
    try {
        const record = await db.collection("users").getOne(req.query.id);
        let user = {
            id: record.id,
            color: record.color,
        }
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: "User not found" });
    }
});

// Получить или создать пользователя при входе через Auth0
router.get("/auth-user", async (req, res) => {
    try {
        // Проверяем, авторизован ли пользователь
        if (!req.oidc || !req.oidc.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const auth0User = req.oidc.user;
        const auth0Id = auth0User.sub; // Уникальный ID из Auth0
        const email = auth0User.email;
        const name = auth0User.name;
        const picture = auth0User.picture;

        // Пытаемся найти пользователя по Auth0 ID
        let existingUser;
        try {
            existingUser = await db.collection("users").getFirstListItem(`auth0_id = "${auth0Id}"`);
        } catch (error) {
            // Пользователь не найден, это нормально
            existingUser = null;
        }

        if (existingUser) {
            // Пользователь существует, возвращаем его
            return res.json({
                id: existingUser.id,
                email: existingUser.email,
                name: existingUser.name,
                picture: existingUser.picture,
                color: existingUser.color,
                isNewUser: false
            });
        }

        // Создаём нового пользователя
        const newUser = await db.collection("users").create({
            auth0_id: auth0Id,
            email: email,
            name: name,
            picture: picture,
            color: "#3b82f6" // Цвет по умолчанию (синий)
        });

        res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            picture: newUser.picture,
            color: newUser.color,
            isNewUser: true
        });

    } catch (error) {
        console.error("Auth error:", error);
        res.status(500).json({ error: "Authentication failed" });
    }
});

module.exports = router