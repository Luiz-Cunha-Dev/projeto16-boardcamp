import { connection } from "../database/db.js";

export async function getCategories(req, res){

    try{
        const categories = await connection.query("SELECT * FROM categories")

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

    try{
        await connection.query("INSERT INTO categories (name) values ($1)", [name])

        res.sendStatus(201)

        
    }catch(err){
        console.log(err);
        res.sendStatus(500)
    }
}