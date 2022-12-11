import { Router } from "express";
import { getRentals, postRentalsInsert, postRentalsConclude, deleteRental } from "../controllers/rentals.Controller.js";

const router = Router();

router.get('/rentals', getRentals);

router.post('/rentals', postRentalsInsert);

router.post('/rentals/:id/return', postRentalsConclude);

router.delete('/rentals/:id', deleteRental);


export default router;