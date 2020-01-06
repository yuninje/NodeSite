const port = 8004;

const express = require('express'); 
const morgan = require('morgan');
const path = require('path');

const pageRouter = require('./routes/index');
const {sequelize} = require('./models');        // /models/index.js 모듈에서 sequelize 객체 반환 

const app = express();
sequelize.sync();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || port);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.use('/', pageRouter);

// 404 error .  라우터에서 걸리지 않았을 경우
app.use((req, res, next) => {
    const err = new Error('Not Found');    
    err.status = 404;
    next(err);
});

// 오류 처리함수
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500); 
    res.render('error', {
        user : req.user
    });    // views/error 페이지를 띄워라
});

// app.get('port') 에서 포트 대기
app.listen(app.get('port') , () => {
    console.log(app.get('port') , '번 포트에서 대기 중');
});