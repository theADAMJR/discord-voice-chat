const express = require('express');
const { getGuild } = require('./mock-api');

const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/assets'));

app.get('/', (req, res) => res.render('index', {
  guild: getGuild()
}));

module.exports.server = app.listen(3000,
    () => console.log('Server is live on port 3000'));

require('./websocket');