var http = require('http');
var fs = require('fs');
var sqlite3 = require('sqlite3');
var crypto = require('crypto')

class Users{
  constructor(db_name){
    this.db_name = db_name;
    this.db = new sqlite3.Database(this.db_name, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Connected to ${this.db_name}`);
    });
    this.createTable();
  }

  createTable() {
    this.db.exec(`
    CREATE TABLE IF NOT EXISTS Points (
        points_val INTEGER not null,
        challenge_name TEXT not null,
        vm_num INTEGER not null,
        date TEXT not null
    );
        `, ()  => {
            console.log("table created");
    });

  }
}



module.exports.Users = Users;