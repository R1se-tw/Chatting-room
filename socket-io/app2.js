const http = require('http')
const app2 = http.createServer()
// const io = require('socket.io')(app2)
var fs = require('fs')

app2.on('request',(req,res)=>{
    fs.readFile(__dirname + '/index.html',
    function(err,data){
        if(err){
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
    })
})

app2.listen(3000,()=>{
    console.log('Successfully Start!');
})

const io = require('socket.io')(app2)

//监听了用户连接的事件
io.on('connection',socket=>{
    console.log('A new client has come in');
    //socket.emit means sending data to the browser
    //
    socket.emit('send',{name: 'zs'})
})