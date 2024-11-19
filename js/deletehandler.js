var mssql = require('mssql'); 

var path = require('path'); 

var queries = require('./queries');

module.exports = {
    loadDeletePage: function(req, res) {
        res.render(path.join(__dirname, '../pages/delete_item_page')); 
    }, 
    deleteRow: function (req, res) { 
         	var query = queries.deleteItem(req, res); 

    }
}