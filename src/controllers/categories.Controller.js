import { connection } from "../database/db.js";

export async function getCategories(req, res){
    const offset = req.query.offset
    const limit = req.query.limit

    try{
        const categories = await connection.query("SELECT * FROM categories OFFSET $1 LIMIT $2", [offset, limit])

        if(!categories){
            console.log("Not found");
            res.sendStatus(404)
        }

        res.send(categories.rows).status(200)

    }catch(err){
        console.log(err);
        res.sendStatus(500)
    }
}

export async function postCategories(req, res){
    const {name} = req.body;

    if(!name){
        res.sendStatus(400)
        return
    }

    try{
        const category = await connection.query("SELECT * FROM categories WHERE name = $1", [name])

        if(category.rows.length !== 0){
            res.sendStatus(409)
            return
        }

        await connection.query("INSERT INTO categories (name) values ($1)", [name])

        res.sendStatus(201)

        
    }catch(err){
        console.log(err);
        res.sendStatus(500)
    }
}