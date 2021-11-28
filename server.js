const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
const path = require('path');
const session = require('express-session');
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

// 初始化seesion
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
}));

var contract;
var username = '';
var AssetID = 1;


// 登录
app.post('/login', async (req, res) => {
    try{
        username = req.body.username;
        req.session.username = username;
        contract = await initOrg1(username);
        res.render('home');
    }catch(error){
        throw error;
    }

})


app.get('/home', async(req, res) => {
    if (req.session.username){
        res.render('home');
    }else{
        res.redirect('login');
    }  
})

// 测试错误处理
/*
app.get('/err', function(req, res, next){
    throw new Error('错误');
})
*/

app.get('/', (req, res) => {
    if (req.session.username){
        res.redirect('home');
    }else{
        res.redirect('login');
    }
})

app.get('/login', async (req, res) => {
    res.render('login');
})


// 返回新增
app.get('/create', async (req, res) => {
    if (req.session.username){
        res.render('create');
    }else{
        res.redirect('login');
    }
    
})

// 新增
app.post('/create', async (req, res) => {
    try{
        const username = req.body.username
        const amount = req.body.amount
        const id = AssetID.toString();
        const output = await create(contract, username, id, amount);
        AssetID += 1;
        res.send(output);
    }catch(error){
        throw error;
    }
})

app.get('/read', async (req, res) => {
    if (req.session.username){
        res.render('read');
    }
    res.redirect('login');
})

// 读取没有问题
app.post('/read', async (req, res, next) => {
    try{
        const id = req.body.userid;
        console.log(req.body, id);
        const output = await read(contract, id);
        //res.json({"用户名":"温家俊", "用户编号":"1", "用电量":"100"});
        res.send(output);
    }catch(error){
        throw error;
    }

})

app.get('/readAll', async (req, res) => {
    if (req.session.username){
        try{
            //var output = "你想查询所有的吗?"
            const output = await readAll(contract);
            console.log(output);
            res.json(output);
        }catch(error){
            throw error;
        }
    }else{
        res.redirect('login');
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

/*  
*
*
*   以下是处理交易的，可以设置transaction路由，偷懒不设置了
*/

app.get('/transaction', async (req, res) => {
    if (req.session.username){
        res.render('transaction');
    }else{
        res.redirect('login');
    }
    
})

app.get('/transaction/readRequest', async (req, res) => {
    if (req.session.username){
        try{           
            const output = await readRequest(contract);
            //var output = [{"id":"1", "demander":"2", "proposal":"3", "requestTime":"4", "complete":"5"}]
            res.json(output);
        }catch(error){
            throw error;
        }
    }else{
        res.redirect('login');
    }
})

app.get('/transaction/handle', async (req, res) => {
    if (req.session.username){
        try{
            const output = await handle(contract);
            //var output =  [{"id":"1", "proposal":"", "requestTime":"", "res":"-1"}]
            console.log(output);
            res.json(output);
        }catch{
            throw error;
        }
    }else{
        res.redirect('login');
    }


})

// 错误处理中间件
app.use(function(err, req, res, next){
    res.send(err.stack);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
