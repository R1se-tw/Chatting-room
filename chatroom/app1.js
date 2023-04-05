const ws = require('nodejs-websocket')
const TYPE_ENTER = 0
const TYPE_LEAVE = 1
const TYPE_MSG = 2
let count = 0;
const server = ws.createServer(conn =>{
   console.log('新的连接')
   count++
   conn.userName = `用户${count}`
   broadcast({
       type: TYPE_ENTER,
       msg:`${conn.userName}进入了聊天室` ,
       time:new Date().toLocaleTimeString()
   })

   conn.on('text',data=>{
      broadcast({
        type: TYPE_MSG,
        msg:data,
        time:new Date().toLocaleTimeString()
      })
   })

   conn.on('close', data=>{
    console.log('Connection Closed')
    count--;
    broadcast({
        type:TYPE_LEAVE,
        msg:`${conn.userName}离开了聊天室` ,
        time:new Date().toLocaleTimeString()
    })
})
   
    conn.on('error',data=>{
       console.log('Wrong Connection')
})
})

function broadcast(msg){
    server.connections.forEach(item =>{
        item.send(JSON.stringify(msg))
    })
}

server.listen(3001,()=>{
    console.log('监听端口3001')
})