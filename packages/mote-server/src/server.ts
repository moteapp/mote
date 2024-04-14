import express, { Request, Response } from 'express';

const PORT = 80;
const app = express();

app.get("/", (request: Request, response: Response) => { 
    response.status(200).send("Hello World");
  }); 
  
app.listen(PORT, () => { 
    console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
});