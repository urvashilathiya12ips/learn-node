const express = require('express');
const app = express();
const port = 3000;
const {User} = require('./models') 

app.set('view engine','ejs');

app.get('/', async(req, res) => {
const data=await User.findAll();
//console.log(data);
 res.render('index',{data:data});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})