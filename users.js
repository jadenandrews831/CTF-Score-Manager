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
    });
    this.createTable();
  }

  createTable() {
    this.db.exec(`
    CREATE TABLE IF NOT EXISTS Points (
        points_val INTEGER not null,
        challenge_name TEXT not null,
        vm_ip TEXT not null,
        date TEXT not null
    );
        `, ()  => {
            // 8
    });

  }

  addPoints(points){
    this.db.all(`
    INSERT INTO Points (points_val, challenge_name, vm_ip, date) VALUES (@val, @name, @ip, @date);
    `, {'@val': points["val"], '@name': points['name'], '@ip': points['ip'], '@date': points['date']}, (err) => {
      if (err){
        console.log(err)
      } else {
        console.log('Points added')
      }
    })
  }

  getPoints() {
    return new Promise(send => {
      this.db.all(`
      SELECT * FROM Points
      `, (err, pts) => {

        console.log("addPoints >>> ", pts)
        if (err) {
          console.log(err)
          send(undefined)
        } else {
          console.log("addPoints >>> Points Added")
          send(pts)
        }
      })  
    })
  }

  checkPoints(pkg) {
    return new Promise(send => {
      this.db.all(`
      SELECT * FROM Points WHERE date=@date AND vm_ip=@ip AND challenge_name=@name
      `, {"@date": pkg['date'], "@ip": pkg['ip'], "@name":pkg['name']}, (err, pts) => {
        console.log("checkPoints >>> ", pts, pkg)
        if (err) {
          console.log(err)
          send(undefined)
        } else {
          send(pts)
        }
      })
    })
  }
}



module.exports.Users = Users;