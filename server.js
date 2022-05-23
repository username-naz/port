import express from 'express';
import 'dotenv/config';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.static('public'));
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')));

app.get('/', (req, res)=>{
    res.send('index');
});

app.listen(process.env.PORT ?? 3000, ()=>{
    console.log("listening on port ", process.env.PORT ?? 3000)
});