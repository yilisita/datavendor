const express = require('express')
const cors = require('cors')
const app = express()
const port = 4000
const path = require('path');
const {    
    initOrg1,
    create,
    read,
    readAll,
    readRequest,
    handle,
    update,
} = require('./application/operate.js');  //注意路径的书写方式；

// 以下三行必须添加，用来读取req.body中的数据
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'html');
app.engine('.html', require('ejs').__express);
app.use(express.static(path.join(__dirname, 'public')));

var contract;
var username = '';
var AssetID = 1;


// 登录
app.post('/login', async (req, res) => {
    try{
        username = req.body.username;
        contract = await initOrg1(username);
        res.render('index1');
    }catch(error){
        throw error;
    }

})

// 测试错误处理
app.get('/err', function(req, res, next){
    throw new Error('错误');
})

app.get('/', (req, res) => {
    res.render('login');
})

app.get('/login', async (req, res) => {
    res.render('login');
})

app.post('/create', async (req, res) => {
    try{
        const username = req.body.username
        const amount = req.body.amount
        const id = AssetID;
        const output = await create(contract, username, id, amount);
        AssetID += 1;
        //const output = spawn('node', ['../../dataVendor/create.js', username, id, amount]).stdout
        res.send(output);
    }catch(error){
        throw error;
    }
})

app.get('/read', async (req, res, next) => {
    try{
        const id = req.query.id;
        const output = await read(contract, id);
        res.json(output)
    }catch(error){
        throw error;
    }

})

app.get('/readAll', async (req, res) => {
    try{
        const output = await readAll(contract);
        res.json(output);
    }catch(error){
        throw error;
    }

})

app.post('/update', async (req, res) => {
    try{
        const username = req.body.username;
        const userID = req.body.id;
        const amount = req.body.amount;
        const output = await update(contract, username, userID, amount);
        res.send(output);
    }catch(error){
        throw error;
    }

})

app.get('/readRequest', async (req, res) => {
    try{
        const output = await readRequest(contract);
        res.json(output);
    }catch(error){
        throw error;
    }

})

app.get('/handle', async (req, res) => {
    try{
        const output = await handle(contract);
        res.json(output);
    }catch{
        throw error;
    }

})

app.use(function(err, req, res, next){
    res.send(err.stack);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

