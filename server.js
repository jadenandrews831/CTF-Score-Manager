const express = require('express')
const system = require('system-commands')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

var users = require('./users.js'); 
const db = new users.Users('users.db');

const app = express()

app.get('/', (req, res) => {
  res.sendFile(dirname+"/src/index.html")
})

app.listen(8080, () => {
  console.log(">".repeat(10)+"Juice Shop Score Manager"+"<".repeat(10)+"\n")
  console.log("SERVER "+">".repeat(3)+" Listening on Port http://localhost:8080")
  readline.setPrompt(`How many VMs would you like to start?\n>\t`)
  readline.prompt()
  readline.on('line', (num) => {
    system("pwd").then((output) => {
      console.log(output);
    }).catch(err => {
      console.log(err)
    });
    console.log("VMs: "+num)
  })
  
})