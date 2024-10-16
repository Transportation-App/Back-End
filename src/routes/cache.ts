import express, { Router, Request, Response } from "express";
import { checkDataInCache, getSessionData } from "../middlewares/cacheMiddleware";
import { paymentInfo } from "../types/types";

const cacheRouter: Router = express.Router();

cacheRouter.use(express.json())

cacheRouter.post("/get", (req: Request<{}, {},{sessionID: string}>, res: Response) => {
    const {sessionID} = req.body

    const data: ({id: string, data: paymentInfo | undefined}) = getSessionData(sessionID)
    
    if(data.data) {
        const receiptData = {id: data.id, totalPrice: data.data.totalPrice}
        res.status(200).json(receiptData)
    }
    else {
        res.status(400).json({message: "Data either expired or the weren't found!"})
    }
});

cacheRouter.post("/check", (req: Request<{}, {},{sessionID: string}>, res: Response) => {
    const {sessionID} = req.body

    const isStored: boolean = checkDataInCache(sessionID)

    if(isStored) {
        res.status(200).json({isStored: isStored})
    }
    else {
        res.status(400).json({message: "Data do not exist!"})
    }
});

export default cacheRouter