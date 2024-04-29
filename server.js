const express = require('express')
const system = require('system-commands')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

var users = require('./users.js'); 
const db = new users.Users('users.db');

const app = express()

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next();
})

app.get('/', (req, res) => {
  res.sendFile(__dirname+"/src/index.html")
})

app.get('/index.js', (req, res) => {
  res.sendFile(__dirname+"/src/index.js")
})

app.get('/score', (req, res) => {
  getScore(req, res)
})

app.post("/upload", (req, res) => {
  upload(req, res)
})

async function getScore(req, res) {
  let score = 0

  let total_score = await db.getPoints()
  let ips = await db.getIPs()
  console.log("IPs:", ips )
  score = {}

  for (let i = 0; i < ips.length; i++){
    let pts = await db.getIPPoints(ips[i]["vm_ip"])
    console.log("getIPPoints >>>", pts)
    score[ips[i]["vm_ip"]] = pts
    
  }
  console.log("SCORE >>>",JSON.stringify(score))

  res.json({score: score})
}

async function upload(req, res){
  console.log("Req.query['data'] >>",req.query["data"])
  const data = JSON.parse(req.query["data"])
  console.log("Data >>",data)

  console.log("Upload "+">".repeat(4)+" "+Object.values(data))
  let con_ip = req.ip.split("f:")[1]
  for(let i = 0; i < Object.keys(data).length; i++){
    let name = data[i][0]
    let val = data[i][1]
    let ip = con_ip
    let date = data[i][3]

    let points = {name: name, val: val, ip: ip, date: date}
    const check = await db.checkPoints({ip: ip, date: date, name: name})
    console.log("Check:", check)
    console.log(check.length == 0, check)
    console.log('I:', i)
    if (check.length > 0) {continue}
    db.addPoints(points)
    
  }
  res.json({data:"success"})
  const pts = await db.getPoints()
  console.log("PTS: ", pts)
  
}

app.listen(8080, () => {
  console.log(">".repeat(10)+"Juice Shop Score Manager"+"<".repeat(10)+"\n")
  console.log("SERVER "+">".repeat(3)+" Listening on Port http://localhost:8080")
  readline.setPrompt(`How many VMs would you like to start?\n>\t`)
  readline.prompt()
  readline.on('line', (num) => {
    num = Number(num)
    console.log(typeof num)
    for(let i = 0; i < num; i++) {
      system(`vboxmanage clonevm 'Ubuntu Machine' --name='Ubuntu Clone_${i+1}' --snapshot 'Finalized Client' --options=link --register`).then((output) => {
        console.log(output);
        system(`vboxmanage discardstate 'Ubuntu Clone_${i+1}'`).then((out) => {
          console.log(out)
          system(`vboxmanage startvm 'Ubuntu Clone_${i+1}'`).then((o) => {
            console.log(o)
          }).catch(err => {
            if (err.includes('tried to lock the machine')){
            }else {
              console.log("start",err)
              process.exit(1)
            }
            
          })
        }).catch (err => {
          if (err.includes('tried to lock the machine')){
          }else {
            console.log("discard", err)
            process.exit(1)
          }
        })
      }).catch(err => {
        if (err.includes("already exists")){
          system(`vboxmanage discardstate 'Ubuntu Clone_${i+1}'`).then((out) => {
            console.log(out)
            system(`vboxmanage startvm 'Ubuntu Clone_${i+1}'`).then((o) => {
              console.log(o)
            }).catch(err => {
              if (err.includes('tried to lock the machine')){
              }else {
                console.log("start",err)
                process.exit(1)
              }
              
            })
          }).catch (err => {
            if (err.includes('tried to lock the machine')){
            }else {
              console.log("discard", err)
              process.exit(1)
            }
          })
        } else {
          console.log(err)
          process.exit(1)
        }
        
      });
      
      
    }
    
    process.on('SIGINT', function () {
      for(let i = 0; i < num; i++){
        system(`vboxmanage controlvm 'Ubuntu Clone_${i+1} acpipowerbutton`).then(o => {
          console.log(o)
          system(`vboxmanage unregister 'Ubuntu Clone_${i+1}'`).then((o) => {
            console.log(o)
          }).catch(err => {
            console.log(err)
          })
        }).catch(err => {
          console.log(err)
          
        })
        
      }
      process.exit(1)
    })
    
  })
  
})