const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser'); 
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//load user and story model
require('./models/User');
require('./models/Story');
//passport
require('./config/passport')(passport);
//handlebars helpers
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
} = require('./helpers/hbs');

//load keys
const keys = require('./config/keys');

//load routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');



//map global promises
mongoose.Promise = global.Promise;


//mongoose connect
mongoose.connect(keys.mongoURI,{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
.then(()=>console.log('MOngo connected'))
.catch(err => console.log('error')); 

const app = express();

 


//Body parser MiddleWare
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Method override middleware
app.use(methodOverride('_method'));


//handlebars middleware
app.engine('handlebars', exphbs({
    helpers:{
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        editIcon: editIcon
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


app.use(cookieParser());
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized: false
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global users 
app.use((req,res,next)=>{
    res.locals.user = req.user || null;
    next();
});

//set static folder
app.use(express.static(path.join(__dirname,'public')));
//use auth
app.use('/',index);
app.use('/auth',auth);
app.use('/stories',stories);




const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log('server started');
});


//app.get('/',(req,res)=>{
  //  res.send('hi its works');
//});




