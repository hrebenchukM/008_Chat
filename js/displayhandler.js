var mssql = require('mssql');

var queries = require('./queries');  

module.exports = {
    displayItems: function(req, res) {  

			var query = queries.getAllItems(req, res)

    },
    adminLogin: function (req, res) {
    
        queries.verifyAdmin(req, res); 
    }
}