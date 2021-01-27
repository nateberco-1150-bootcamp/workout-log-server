require("dotenv").config();
let express = require('express');
let app = express();
let sequelize = require('./db');

let log = require('./controllers/log-controller');
let user = require('./controllers/user-controller');

app.use(require('./middleware/headers'))

sequelize.sync();
//sequelize.sync({force: true})

app.use(express.json());

app.use('/user', user);
app.use('/log', log);




app.listen(4000, function() {
    console.log('App is listening on port 4000');
})