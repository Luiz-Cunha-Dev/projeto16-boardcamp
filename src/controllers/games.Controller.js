import { connection } from "../database/db.js";

export async function getGames(req, res){

    try{
        const games = await connection.query(`SELECT games.*, categories.name AS "categoryName", games.name FROM games JOIN categories ON games."categoryId" = categories.id`)

        if(!games){
            console.log("Not found");
            res.sendStatus(404)
        }

        res.send(games.rows).status(200)

    }catch(err){
        console.log(err);
        res.sendStatus(500)
    }
}

export async function postGames(req, res){
    const {name, image, stockTotal, categoryId, pricePerDay} = req.body;

    try{
        await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") values ($1, $2, $3, $4, $5)`, [name, image, stockTotal, categoryId, pricePerDay])

        res.sendStatus(201)

        
    }catch(err){
        console.log(err);
        res.sendStatus(500)
    }
}