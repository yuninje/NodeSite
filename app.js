const port = 8004;

const express = require('express'); 
const morgan = require('morgan');
const path = require('path');



const pageRouter = require('./routes/index');
const {sequelize} = require('./models');        // /models/index.js 모듈에서 sequelize 객체 반환 

// 로그인 관련
const cookieParser = require('cookie-parser'); // 쿠키를 쉽게 추출 할 수 있게 도와주는 모듈
const passport = require('passport');
const passportConfig = require('./passport');
const session = require('express-session');
const flash = require('connect-flash'); // 사용자에게 일회성 메세지를 날려주는 모듈

require('dotenv').config();

const app = express();
sequelize.sync();      // 서버가 실행될 때마다 시큐어라이즈의 스키마를 디비에 적용 
passportConfig(passport); // passport/index  모듈 실행

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || port);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended : false}));

// 로그인 관련
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({       // 세션 설정
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET,
    cookie : {
        httpOnly : true,
        sequre : false,
    }
}));
app.use(flash());           // flash 모듈 장착
app.use(passport.initialize());
app.use(passport.session());

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