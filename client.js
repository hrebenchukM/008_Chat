var socket = io.connect('http://localhost:8080');
var user = '';

window.onload = function () {

    var users_container = document.getElementById('userlist');
    var message_container = document.getElementById('messages');

    message_container.style.height = window.innerHeight - 200 + 'px';

    var btn = document.getElementById('btn');
    var message_input = document.getElementById('inp');
    var themeBtn = document.getElementById('theme-btn');

    // загрузить имена пользователей, которые online 
    socket.emit('load users');//генерируем новое событие load users
    socket.on('users loaded', function (data) {//подписываемся на событие users loaded
        // получаем каждого юзера и формируем в виде списка
        var display_users = data.users.map((username) => {
            return `<li>${username}</li>`;
        });

        users_container.innerHTML = display_users.join(' ');
    });



    // загрузить сообщения других пользователей (при загрузке страницы)
    socket.emit('load messages');//генерируем новое событие load messages
    socket.on('messages loaded', function (data) {//подписываемся на событие сервера messages loaded
 
        // получаем каждое сообщение и формируем 
        var display_messages = data.messages.map((msg) => {

            return (`<div class ="panel well >
                         <h4>${msg.author}</h4>
                         <h5>${msg.text}</h5>
                    </div>`)
        });

        message_container.innerHTML = display_messages.join(' ');
    });

    // загрузить текущее сообщение
    socket.on('chat message', function (message) {//подписываемся на соытие сервера chat message
        console.log(message)


        //показали в формате автор и сообщение
        var display_message = `<div class ="panel well ${message.author === user ? 'my' : 'other'}">
                                   <h4>${message.author}</h4>
                                   <h5>${message.text}</h5>
                               </div>`
        message_container.innerHTML += display_message;

    });

    // получить имя пользователя 
    socket.on('new user', function (data) {//подписываемся на событие сервера добавление нового юзера

        user = data.name;
    })


    btn.onclick = function () {
        // сгенерировать событие отправки сообщения 
        socket.emit('send message', { text: message_input.value, author: user });

    }

    themeBtn.onclick = function () {
        if (document.body.className === 'dark-theme') {
            document.body.className = '';  
        } else {
            document.body.className = 'dark-theme';
        }
    }

}