const ws = require('nodejs-websocket')
const PORT = 3000
//每次只要有用户连接，就会给当前连接的用户创建一个connect对象
const server = ws.createServer(connect =>{
    console.log('有用户连接上了')
    connect.on('text',data =>{
        console.log('Received',data)
        connect.send(data)
    })

    connect.on('close', ()=>{
        console.log('连接断开')
    })

    connect.on('error',()=>{
        console.log('用户连接异常')
    })
})

server.listen(PORT, ()=>{
    console.log('websocket服务器启动成功了,监听了端口'+ PORT)
})