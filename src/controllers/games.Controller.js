import { connection } from "../database/db.js";

export async function getGames(req, res){
    const name = req.query.name
    let games;
    try{
        if(!name){
            games = await connection.query(`SELECT games.*, categories.name AS "categoryName", games.name FROM games JOIN categories ON games."categoryId" = categories.id`)
        }else{
            games = await connection.query(`SELECT games.*, categories.name AS "categoryName", games.name FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.name LIKE $1`, [`${name}%`])
        }
        

        if(!games.rows.length === 0){
            res.sendStatus(404)
            return
        }

        res.send(games.rows).status(200)

    }catch(err){
        console.log(err);
        res.sendStatus(500)
    }
}

export async function postGames(req, res){
    const {name, image, stockTotal, categoryId, pricePerDay} = req.body;

    if(!name || stockTotal <= 0 || pricePerDay <= 0){
        res.sendStatus(400)
        return
    }

    try{
        const category = await connection.query("SELECT * FROM categories WHERE id = $1", [categoryId])

        if(!category.rows.length === 0){
            res.sendStatus(400)
            return
        }

        const game = await connection.query("SELECT * FROM games WHERE id = $1", [name])

        if(!game.rows.length !== 0){
            res.sendStatus(409)
            return
        }

        await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") values ($1, $2, $3, $4, $5)`, [name, image, stockTotal, categoryId, pricePerDay])

        res.sendStatus(201)
        
    }catch(err){
        console.log(err);
        res.sendStatus(500)
    }
}