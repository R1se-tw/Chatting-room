var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
const users = []
server.listen(3000,()=>{
    console.log('Successfully start!')
})

app.use(require('express').static('public'))
//直接访问根目录，重定向到首页
app.get('/',function(req,res){
    res.redirect('/index.html')
})

io.on('connection',function(socket){
    socket.on('login',data=>{
         let user = users.find(item=>item.username===data.username)
         if(user) {
            //the user has logged in
            socket.emit('loginError',{mag:'log in Error'})
            console.log('登录失败')
         }else{
            users.push(data)
            socket.emit('loginSuccess', data)
            console.log('登陆成功')
            //broadcast
            io.emit('addUser',data)

            //how many people in the chatting room
            io.emit('userList',users)
            //to store the user's name and avatar
            socket.username = data.username;
            socket.avatar = data.avatar;


         }
        
    })

    socket.on('disconnect',()=>{
         let idx = users.findIndex(item => item.username===socket.username)
         //remove the user who has logged out
         users.splice(idx,1)
         io.emit('delUser',{
            username:socket.username,
            avatar:socket.avatar
         })
         io.emit('userList',users)
    })

    socket.on('sendMessage',data=>{
        console.log(data)
        //broadcast
        io.emit('receiveMessage',data)

    })

    socket.on('sendImage',data=>{
        io.emit('receiveImage',data)
    })
})
