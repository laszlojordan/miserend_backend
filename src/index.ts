import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {MongoConnector} from "./mongoAdapter";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/apiget", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.put("/api/miserend/:id", (req: Request, res: Response) => {
  console.log("> PUT");
  console.log(req.body);
  req.body._id = req.body.id;
  const mongoConnector = new MongoConnector();
  mongoConnector.connectToDB().then( async () => {
    const result = await mongoConnector.update(req.body);
    res.send(result);
  });
  console.log("< PUT");
});

app.delete("/api/miserend/:id",(req: Request, res: Response) => {
  console.log("> DELETE");
  console.log(req.params);
  const mongoConnector = new MongoConnector();
  mongoConnector.connectToDB().then( async () => {
    const result = await mongoConnector.remove(req.params.id)
    res.send(result);
  });
  console.log("< PUT");
});

app.post("/api/miserend/", (req: Request, res: Response) => {
  console.log("> POST");
  console.log(req.body);

  if(req.body._id){
    res.send('')
  }
  else{
    req.body._id = req.body.id;
    const mongoConnector = new MongoConnector();
    mongoConnector.connectToDB().then( async () => {
      const result = await mongoConnector.insert(req.body);
      res.send(result);
    })
  }
  console.log("< POST");
});


app.listen(port, () => {
  console.log(`Server started listening on port: ${port}`);
});
