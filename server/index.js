const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const { Pool } = require("pg");


const PORT = 5000;
const ITEMS_AMOUNT = 500;
const ITEMS_PER_PAGE = 20;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'reality-postgres',
    database: 'reality',
    password: 'db2023',
    port: 5432,
});


const scrapeFlats = async (amount) => {
    try {
        const response = await axios(`https://www.sreality.cz/api/cs/v2/estates?category_main_cb=1&category_type_cb=1&per_page=${amount}`);
        return response?.data?._embedded?.estates ?? [];
    } catch (error) {
        throw error;
    }
};

const processAndSave = async (flats) => {
    for (const flat of flats) {
        const title = flat?.name;
        const image = flat?._links?.image_middle2?.[0]?.href;
        const url = `https://www.sreality.cz/detail/prodej/byt/size/location/${flat?.hash_id}`;

        try {
            await saveToDB(title, image, url);
        } catch (error) {
            throw error;
        }
    }
};

const saveToDB = async (title, image, url) => {
    try {
        await pool.query('INSERT INTO reality (title, image, url) VALUES ($1, $2, $3)', [title, image, url]);
    } catch (error) {
        throw error;
    }
}


app.get('/start', async (req, res) => {
    const itemsAmountQuery = 'SELECT COUNT(*) FROM reality';
    const createTableQuery = `CREATE TABLE IF NOT EXISTS reality (
        title VARCHAR(255),
        image VARCHAR(255),
        url VARCHAR(255)
    )`;

    try {
        await pool.query(createTableQuery);

        const itemsAmountResult = await pool.query(itemsAmountQuery);
        const curItemsAmount = parseInt(itemsAmountResult.rows[0].count);

        if (curItemsAmount >= ITEMS_AMOUNT) {
            return res.status(200).send('Ok');
        } else {
            const itemsAmountToFetch = ITEMS_AMOUNT - curItemsAmount;
            const flats = await scrapeFlats(itemsAmountToFetch);

            await processAndSave(flats);

            res.status(200).send('ok');
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/flats_list', async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const offset = page * ITEMS_PER_PAGE;

        let hasMore = true;
        if (offset + ITEMS_PER_PAGE >= 500) {
            hasMore = false;
        }

        const getFlatsQuery = `SELECT * FROM reality ORDER BY url LIMIT 20 OFFSET ${page * ITEMS_PER_PAGE}`;
        const list = await pool.query(getFlatsQuery);

        res.status(200).send({
            flats: list.rows,
            hasMore,
        })
    } catch (error) {
        res.status(500).send(error);
    }
})


const start = () => {
    try {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();
