/* 
  聊天室的主要功能
*/
/* 
  1. 连接socketio服务
*/
var socket = io('http://localhost:3000')
var username,avatar
/*
  登录功能
*/
$('#login_avatar li').on('click', function() {
  $(this)
    .addClass('now')
    .siblings()
    .removeClass('now')
})
//log in
$('#loginBtn').on('click', function() {
  // 获取用户名
  var username = $('#username')
    .val()
    .trim()
  if (!username) {
    alert('请输入用户名')
    return
  }
  // 获取选择的头像
  var avatar = $('#login_avatar li.now img').attr('src')

  // 需要告诉socket io服务，登录
  socket.emit('login', {
    username: username,
    avatar: avatar
  })
})

socket.on('loginError',data=>{
  alert('登录失败！用户名已存在！')
})

socket.on('loginSuccess',data=>{
  //display the chatting format and hide the login box
  $('.login_box').fadeOut();
  $('.container').fadeIn();
  console.log(data)
  $('.avatar_url').attr('src',data.avatar)
  $('.user-list .username').text(data.username)

  username = data.username
  avatar = data.avatar
})

socket.on('addUser',data=>{
  $('.box-bd').append(`
    <div class="system">
    <p class="message_system">
      <span class="content">${data.username}加入了群聊</span>
    </p>
  </div>
  ` )
  scrollIntoViewa()
})

socket.on('userList', data => {
  // 把userList中的数据动态渲染到左侧菜单
  $('.user-list ul').html('')
  data.forEach(item => {
    $('.user-list ul').append(`
      <li class="user">
        <div class="avatar"><img src="${item.avatar}" alt="" /></div>
        <div class="name">${item.username}</div>
      </li>      
    `)
    scrollIntoView()
  })

  $('#userCount').text(data.length)
})

socket.on('delUser',data=>{
  $('.box-bd').append(`
  <div class="system">
  <p class="message_system">
    <span class="content">${data.username}离开了群聊</span>
  </p>
</div>
    `)
})

//chatting box
$('.btn-send').on('click',()=>{
  var content = $('#content').html()
  $('#content').html('')
  if(!content) return alert('Please input!')

   socket.emit('sendMessage',{
     msg:content,
     username:username,
     avatar:avatar
   })
})

socket.on('receiveMessage',data=>{
  //display the msg in the box
  if(data.username === username)
  {
     //My message
     $('.box-bd').append(`
     <div class="message-box">
     <div class="my message">
       <img class="avatar" src="${data.avatar}" alt="" />
       <div class="content">
         <div class="bubble">
           <div class="bubble_cont">${data.msg}</div>
         </div>
       </div>
     </div>
   </div>
     `)
  }else{
     $('.box-bd').append(`
     <div class="message-box">
     <div class="other message">
       <img class="avatar" src="${data.avatar}" alt="" />
       <div class="content">
         <div class="nickname">${data.username}</div>
         <div class="bubble">
           <div class="bubble_cont">${data.msg}</div>
         </div>
       </div>
     </div>
   </div>
     `)
  }

  scrollIntoView();
})

function scrollIntoView() {
  // 当前元素的底部滚动到可视区
  $('.box-bd')
    .children(':last')
    .get(0)
    .scrollIntoView(false)
}

//send the image
$('#file').on('change',function(){
  var file = this.files[0]
  //use fileRead to send the image
  var fr = new FileReader()
  fr.readAsDataURL(file)
  fr.onload = function() {
    socket.emit('sendImage', {
      username: username,
      avatar: avatar,
      img: fr.result
    })
  }
})

socket.on('receiveImage',data=>{
  if(data.username === username)
  {
     //My message
     $('.box-bd').append(`
     <div class="message-box">
     <div class="my message">
       <img class="avatar" src="${data.avatar}" alt="" />
       <div class="content">
         <div class="bubble">
           <div class="bubble_cont">
           <img src="${data.img}">
           </div>
         </div>
       </div>
     </div>
   </div>
     `)
  }else{
     $('.box-bd').append(`
     <div class="message-box">
     <div class="other message">
       <img class="avatar" src="${data.avatar}" alt="" />
       <div class="content">
         <div class="nickname">${data.username}</div>
         <div class="bubble">
           <div class="bubble_cont">
           <img src="${data.img}">
           </div>
         </div>
       </div>
     </div>
   </div>
     `)
  }
  scrollIntoView();
})

$('.face').on('click',function(){
  $('#content').emoji({
    button:'.face',
    showTab: false,
      animation: 'slide',
      position: 'topRight',
      icons: [
        {
          name: 'QQ表情',
          path: 'lib/jquery-emoji/img/qq/',
          maxNum: 91,
          excludeNums: [41, 45, 54],
          file: '.gif'
        }
      ]
  })
})