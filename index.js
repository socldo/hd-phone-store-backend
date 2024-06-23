var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

const connectToMongo = require('./config');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const auth = require('./routes/auth');
const cart = require('./routes/cart');
const wishlist = require('./routes/wishlist');
const product = require('./routes/product');
const review = require('./routes/review');
const paymentRoute = require('./routes/paymentRoute');
const forgotPassword = require('./routes/forgotPassword');
const AdminRoute = require('./routes/Admin/AdminAuth');
const OrderRoute = require('./routes/order');
const ReportRouter = require('./routes/report');
const dotenv = require('dotenv');
const checkOrigin = require('./middleware/apiAuth');
const cors = require('cors');
const Message = require('./models/Message');
dotenv.config();


const http = require('http');
const socketIo = require('socket.io');
const port = 5000;


connectToMongo();

app.use(bodyParser.json({
    limit: '20mb'
}));

app.use(bodyParser.urlencoded({
    limit: '20mb',
    parameterLimit: 100000,
    extended: true
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true }))

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));
app.use(checkOrigin);

app.use('/api/auth', auth);
app.use('/api/product', product);
app.use('/api/cart', cart);
app.use('/api/wishlist', wishlist);
app.use('/api/review', review);
app.use('/api/admin', AdminRoute);
app.use('/api', paymentRoute);
app.use('/api/password', forgotPassword);
app.use('/api/order', OrderRoute);
app.use('/api/report', ReportRouter);

// Thiết lập view engine là EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    socket.on('joinRoom', ({ productId, userId }) => {
        socket.join(productId);
        console.log(`${userId} joined room ${productId}`);
    });

    socket.on('leaveRoom', ({ productId, userId }) => {
        socket.leave(productId);
        console.log(`${userId} left room ${productId}`);
    });

    socket.on('sendMessage', async ({ productId, userId, message }) => {
        const msg = new Message({ productId, userId, message });
        await msg.save();
        console.log(msg);
        io.to(productId).emit('message', msg);
    });
});

server.listen(port, () => {
    console.log(`Server and Socket.IO are running on port ${port}`);
});
