var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var md5 = require('MD5');
var morgan = require('morgan');
var rest = require("./REST.js");
var app  = express();
app.use(bodyParser.json());
app.use(express.static(__dirname+"/public"));
app.get('*',function(req,res){
  console.log(__dirname)
  res.sendfile(__dirname + '/public/app/views/index.html');
 //res.write('Helowo')
})
/*var config=require('./config')
var app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.get('*',function(req,res){
  console.log(__dirname)
  res.sendfile(__dirname + '/public/views/index.html');
 //res.write('Helowo')
})
app.listen(config.port,function(err){
  if(err)
      console.log("Error Occurs")
    else
      console.log("listen at "+config.port);
});*/
function REST(){
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'mms',
        debug    :  false
    });
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);
        }
    });
}

REST.prototype.configureExpress = function(connection) {
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/api', router);
      var rest_router = new rest(router,connection,md5,mysql);
      self.startServer();
}

REST.prototype.startServer = function() {
      app.listen(3000,function(){
          console.log("All right ! I am alive at Port 3000.");
      });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL \n" + err);
    process.exit(1);
}

new REST();