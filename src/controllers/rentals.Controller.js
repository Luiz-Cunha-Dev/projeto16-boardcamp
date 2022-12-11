import { connection } from "../database/db.js";

export async function getRentals(req, res){
    const customerId = req.query.customerId
    const gameId = req.query.gameId
    let rentals;

    try{

        if(!customerId && !gameId){
            rentals = await connection.query("SELECT * FROM rentals")
        }else if(customerId){
            rentals = await connection.query(`SELECT * FROM rentals WHERE rentals."customerId" = $1`, [customerId])
        }else if(gameId){
            rentals = await connection.query(`SELECT * FROM rentals WHERE rentals."gameId" = $1`, [gameId])
        }

        const customers = await connection.query("SELECT customers.id, customers.name FROM customers")
        const games = await connection.query(`SELECT games.id, games.name, categories.id AS "categoryId", categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id`)
        if(!rentals){
            console.log("Not found");
            res.sendStatus(404)
        }

        rentals.rows.forEach(r => {
            r.rentDate = r.rentDate.toISOString().split('T')[0]
            if(r.returnDate !==  null){
                r.returnDate = r.returnDate.toISOString().split('T')[0]
            }
        });

        for (let i = 0; i < rentals.rows.length; i++) {
            rentals.rows[i].customer= customers.rows.find(c => c.id === rentals.rows[i].customerId)
            rentals.rows[i].game= games.rows.find(g => g.id === rentals.rows[i].gameId)
        }

        res.send(rentals.rows).status(200)

    }catch(err){
        console.log(err);
        res.sendStatus(500)
    }
}


export async function postRentalsInsert(req, res){
    const {customerId, gameId, daysRented} = req.body;
    const date = new Date();

    try{
        const game = await connection.query("SELECT * FROM games WHERE id = $1", [gameId])
        const rentailValue = (game.rows[0].pricePerDay)*daysRented

        await connection.query(`INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice") values ($1, $2, $3, $4, $5)`, [customerId, gameId, daysRented, date, rentailValue])

        res.sendStatus(201)

        
    }catch(err){
        console.log(err);
        res.sendStatus(500)
    }
}

export async function postRentalsConclude(req, res){
    const {id} = req.params;
    const date = new Date();

    try{
        const rental = await connection.query("SELECT * FROM rentals WHERE id = $1", [id])

        if(!rental.rows){
            res.sendStatus(404)
            return
        }else if(rental.rows[0].returnDate !== null){
            res.sendStatus(400)
            return
        }

        const delayDays = (rental.rows[0].daysRented - Math.floor((date - rental.rows[0].rentDate)/(1000 * 60 * 60 * 24)))
        let delayFee;

        if(delayDays < 0){
            delayFee = -delayDays * rental.rows[0].originalPrice
        }else{
            delayFee = 0;
        }

        await connection.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE  id = $3`, [date, delayFee, id])

        res.sendStatus(200);

        
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}


export async function deleteRental(req, res){
    const {id} = req.params;

    try{
        let rental = await connection.query("SELECT * FROM rentals WHERE id = $1", [id])

        if(!rental.rows){
            res.sendStatus(404)
            return
        }else if(rental.rows[0].returnDate === null){
            res.sendStatus(400)
            return
        }

        await connection.query("DELETE FROM rentals WHERE id = $1", [id])

        res.sendStatus(200)

        
    }catch(err){
        console.log(err);
        res.sendStatus(500)
    }
}