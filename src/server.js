import express, {json} from "express";
import cors from "cors"
import categoriesRouter from "./routes/categories.Router.js"
import gamesRouter from "./routes/games.Router.js"


const app = express();
app.use(cors());
app.use(json());
app.use(categoriesRouter);
app.use(gamesRouter);




const port = process.env.PORT || 4000

app.listen(port, () => console.log(`Server running in port: ${port}`));