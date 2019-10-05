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
    let user = req.body;
    console.log(user);
    user.id = users.length + 1;
    users.push(user);
    res.render('register')
});

app.get('/users', (req, res) => {
    res.json(users)
});

app.get('/user/:idUser', (req, res) => {
    const idUser = req.params;
    users.forEach( user => {
        user.id = +idUser;
        return res.render('user', { name : `${user.name}`, surname : `${user.surname}`, ID : `${user.id}`})
    })
})

app.post('/login', (req, res) => {
    const {email, password} = req.body;
    users.forEach( user => {
        if (user.email == email && user.password == password) {
            return res.redirect(`user/${user.id}`)
        } else {
            res.json("Page is not found")
        }
    })
})

app.post('/flat', (req, res) => {
    let flat = req.body;
    console.log(flat);
    flat.id = flats.length + 1;
    flats.push(flat);
    res.render('flat');
})


app.get('/flat/:idFlat', (req, res) => {
    const idFlat = req.params;
    flats.find(flat => {
        flat.id === +idFlat;
        return res.render('flatByID', {
            City: `${flat.city}`,
            SquereMetres: `${flat.SquereMetres}`,
            Price: `${flat.price}`
        })
    })
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