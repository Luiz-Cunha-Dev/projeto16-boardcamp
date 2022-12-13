import { connection } from "../database/db.js";
import { customerSchema } from "../schemas/customers.Schema.js";

export async function getCustomers(req, res){
    const cpf = req.query.cpf
    const offset = req.query.offset
    const limit = req.query.limit
    let customers;

    try{
        if(!cpf){
            customers = await connection.query("SELECT * FROM customers OFFSET $1 LIMIT $2", [offset, limit])
        }else{
            customers = await connection.query(`SELECT * FROM customers WHERE cpf LIKE $1 OFFSET $2 LIMIT $3`, [`${cpf}%`, offset, limit])
        }

        

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
        const customer = await connection.query("SELECT * FROM customers WHERE id = $1", [id])

        if(customer.rows.length === 0){
            res.sendStatus(404)
            return
        }

        customer.rows.forEach(c => {
            c.birthday = c.birthday.toISOString().split('T')[0]
        });

        res.send(customer.rows).status(200)

    }catch(err){
        console.log(err);
        res.sendStatus(500)
    }
}

export async function postCustomers(req, res){
    const customer = req.body;
    const {name, phone, cpf, birthday} = customer;
    

    try{
        const {error} = customerSchema.validate(customer, {abortEarly: false});

        if(error){
            const erros = error.details.map(d => d.message);
            res.status(400).send(erros);
            return
        }

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
    const customer = req.body;
    const {name, phone, cpf, birthday} = customer;
    
    try{
        const {error} = customerSchema.validate(customer, {abortEarly: false});

        if(error){
            const erros = error.details.map(d => d.message);
            res.status(400).send(erros);
            return
        }
    
        let existingCpf = await connection.query("SELECT * FROM customers WHERE cpf = $1", [cpf])

        if(existingCpf.rows.length !== 0 && existingCpf.rows[0].id.toString() !== id){
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