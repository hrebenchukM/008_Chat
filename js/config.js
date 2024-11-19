var mssql = require('mssql');

// параметры соединения с бд
var config = {
	user: 'admin',           // пользователь базы данных
	password: '12345',          // пароль пользователя 
	server: 'LENOVO\\SQLEXPRESS',       // хост
	database: 'Chat',          // имя бд
	port: 1433,             // порт, на котором запущен sql server
	  options: {
		  encrypt: true,  // Использование SSL/TLS
		  trustServerCertificate: true // Отключение проверки самоподписанного сертификата
	  },
  }
var connection = new mssql.ConnectionPool(config); 

var pool = connection.connect(function(err) {
	if (err) console.log(err)
}); 

module.exports = pool; 