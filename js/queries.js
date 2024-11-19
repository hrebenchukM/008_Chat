var mssql = require('mssql');
var displayHandler = require('./displayhandler');  

var connection = require('./config'); 

module.exports = {

    tableRows: ``,
    // выбор всех элементов и отображение в виде таблицы 
    getAllItems: function (req, res) {
		
        var self = this; 		
		self.tableRows = ``; 

			var request = new mssql.Request(connection);  
			request.stream = true; 
			request.query("SELECT * FROM Users"); 
			
			request.on('row', function(row){ 
	
				self.tableRows += ` <tr>
							<td>${row.Name} </td>
							<td>${row.Login}</td>
							<td>${row.Password} </td>
							<td>${row.Date}</td>
							<td>${row.Age} </td>
						</tr>` 
			}); 
			
			request.on('done', function(affected) { 
				console.log('show_items'); 
				res.render('index', { data:  self.tableRows }); 
			})		

    }, 
	// добавить элемент в бд
	insertItem: function (data, req, res) {

					var inserts = {						
						Name: data.Name, 
						Login: data.Login, 
						Password: data.Password, 
						Date: data.Date, 
						Age: data.Age
					}
				
				   var ps = new mssql.PreparedStatement(connection);  
				   
				   ps.input('Name', mssql.Text); 
				   ps.input('Login', mssql.Text); 
				   ps.input('Password', mssql.Text); 
				   ps.input('Date', mssql.Date); 
				   ps.input('Age', mssql.Int); 
				  
				   
				   ps.prepare("INSERT INTO Users (Name, Login, Password,Date,Age) VALUES (@Name , @Login, @Password, @Date, @Age)", function(err) { 
						if (err) console.log(err); 
					    var request = ps.execute(inserts, function(err) { 
						
							if (err) console.log(err); 
							console.log('add item'); 
							ps.unprepare(); 

						}); 
				
				
				})
	},
    deleteItem: function(req, res) {
    let Id = req.body.Id; 

    var request = new mssql.Request(connection);
	request.input('Id', mssql.Int, Id);

    request.query(`
        DELETE FROM Users
        WHERE Id = @Id
    `, function(err, result) {
		if (err) console.log(err); 

		if (result.rowsAffected[0] > 0){
            console.log('User with ID', Id, 'deleted');
            return res.redirect('/admin/panel');
        } else {
            console.log('User with ID', Id, 'not found');
            return res.send('<script>alert("User with ID not found!"); window.location.href="/admin/panel";</script>');
        }
        });
    },
	 deleteItem: function(req, res) {
    let Id = req.body.Id; 

    var request = new mssql.Request(connection);
	request.input('Id', mssql.Int, Id);

    request.query(`
        DELETE FROM Users
        WHERE Id = @Id
    `, function(err, result) {
		if (err) console.log(err); 

		if (result.rowsAffected[0] > 0){
            console.log('User with ID', Id, 'deleted');
            return res.redirect('/admin/panel');
        } else {
            console.log('User with ID', Id, 'not found');
            return res.send('<script>alert("User with ID not found!"); window.location.href="/admin/panel";</script>');
        }
        });
    },
	verifyAdmin: function(req, res, next) {
		let Login = req.body.Login;
		let Password = req.body.Password;
		let Name = req.body.Name;
	
		console.log('Запрос на вход:', Name, Login, Password); // Логируем запрос
	
		var request = new mssql.Request(connection);
	
		request.input('Name', mssql.NVarChar(50), Name);
		request.input('Login', mssql.NVarChar(50), Login);
		request.input('Password', mssql.NVarChar(50), Password);
	
		request.query(`
			SELECT * 
			FROM Admins 
			WHERE Name = @Name AND Login = @Login AND Password = @Password
		`, function(err, result) {
			if (err) console.log(err); 
			console.log('GET ' + req.url);

	
		
			if (result.recordset.length > 0) {
				return res.redirect('/admin/panel');
			} else {
				return res.send('<script>alert("Неверные данные для входа!"); window.location.href="/admin";</script>');
			}
		});
	}
	
	
	

}