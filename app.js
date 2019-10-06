const express = require('express');
const expHend = require('express-handlebars');
const path = require('path');

const app = express();

let users = [];
let flats = [];

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, 'static')));

app.engine('.hbs', expHend({
    extname: '.hbs',
    defaultLayout: null
}))

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'static'));

app.get('/', (req, res) => {
    res.render('main');
});

app.get('/register', (req, res) => {
    res.render('register', {layout: false})
});

app.get('/login', (req, res) => {
    res.render('login', {layout: false})
});

app.get('/flat', (req, res) => {
    res.render('flat', {layout: false})
});

app.post('/register', (req, res) => {
    const user = req.body;
    user.id = users.length + 1;
    users.push(user);
    res.render('register')
});

app.get('/users', (req, res) => {
    res.json(users)
});

app.get('/user/:idUser', (req,res)=> {
    const {idUser} = req.params;
    const finder = users.find(user => user.id === +idUser);
   finder ? res.render('user', { name : `${finder.name}`, surname : `${finder.surname}`, City : `${finder.city}`})
        : res.json('This ID is not found')
});

app.post('/login', (req, res) => {
    const person = req.body;
    const finder = users.find( user => user.email === person.email && user.password === person.password);
    finder ? res.redirect(`/user/${finder.id}`) : res.json('Your password or email is not right')
});

app.post('/flat', (req, res) => {
    let flat = req.body;
    flat.id = flats.length + 1;
    flats.push(flat);
    res.render('flat');
})

app.get('/flat/:idFlat', (req, res) => {
    const {idFlat} = req.params;
    const finder = flats.find(flat => flat.id === +idFlat);
    finder ? res.render('flatByID', {SquereMetres: `${finder.SquereMetres}`, Price: `${finder.price}`, City: `${finder.city}`})
        : res.json('This ID is not found')
})

app.get('/flats', (req, res) => {
    res.json(flats)
});

app.all('*', (req, res)=> {
    res.status(505).json(`Page wasn't found`)
});

app.listen(3000, () => {
    console.log("okey")
});
