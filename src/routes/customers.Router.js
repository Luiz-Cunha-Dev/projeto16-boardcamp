import { Router } from "express";
import { getCustomers, getCustomer, postCustomers, putCustomer } from "../controllers/customers.Controller.js";

const router = Router();

router.get('/customers', getCustomers);

router.get('/customers/:id', getCustomer);

router.post('/customers', postCustomers);

router.put('/customers/:id', putCustomer);


export default router;