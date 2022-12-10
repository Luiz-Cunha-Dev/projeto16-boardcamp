import { connection } from "../database/db.js";

export async function getCustomers(req, res){

    try{
        const customers = await connection.query("SELECT * FROM customers")

        if(!customers){
            console.log("Not found");
            res.sendStatus(404)
        }
        customers.rows.forEach(c => {
            c.birthday = c.birthday.toISOString().split('T')[0]
        });

        res.send(customers.rows).status(200)

    }catch(err){
        console.log(err);
        res.sendStatus(500)
    }
}

export async function getCustomer(req, res){
    const {id} = req.params;

    try{
        const customers = await connection.query("SELECT * FROM customers WHERE id = $1", [id])

        if(!customers){
            console.log("Not found");
            res.sendStatus(404)
        }

        customers.rows.forEach(c => {
            c.birthday = c.birthday.toISOString().split('T')[0]
        });

        res.send(customers.rows).status(200)

    }catch(err){
        console.log(err);
        res.sendStatus(500)
    }
}

export async function postCustomers(req, res){
    const {name, phone, cpf, birthday} = req.body;
    

    try{
        let existingCpf = await connection.query("SELECT * FROM customers WHERE cpf = $1", [cpf])

        if(existingCpf.rows.length !== 0){
            res.sendStatus(409)
            return
        }

        await connection.query("INSERT INTO customers (name, phone, cpf, birthday) values ($1, $2, $3, $4)", [name, phone, cpf, birthday])

        res.sendStatus(201)

        
    }catch(err){
        console.log(err);
        res.sendStatus(500)
    }
}

export async function putCustomer(req, res){
    const {id} = req.params;
    const {name, phone, cpf, birthday} = req.body;

    try{
        let existingCpf = await connection.query("SELECT * FROM customers WHERE cpf = $1", [cpf])

        if(existingCpf.rows.length !== 0){
            res.sendStatus(409)
            return
        }

        await connection.query("UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5", [name, phone, cpf, birthday, id])

        res.sendStatus(200)

        
    }catch(err){
        console.log(err);
        res.sendStatus(500)
    }
}