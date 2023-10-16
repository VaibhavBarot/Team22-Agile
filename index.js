import express  from 'express';
import {connect} from './connection.js'
const app = express()
const port = 3000

app.get('/', (req, res) => {
    connect().then((data) => {
        res.send(data);
    });
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})