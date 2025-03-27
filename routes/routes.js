 import express from "express";
 import controle from "../controllers/controle.js";

 const router = express.Router();

//Funçoes
    router.get("/", controle.getControle);

    router.post("/", controle.postControle);

    router.put("/", controle.putControle);

    router.delete("/", controle.deleteControle);

    export default router;
