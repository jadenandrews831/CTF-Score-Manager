

function getScore() {
    
    xhr.open("GET", "http://10.190.110.39:8080/score")
    xhr.send()
    xhr.responseType = 'json'
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = xhr.response
            console.log("getScore >>> ", data)
            document.querySelector('#score').innerHTML = JSON.stringify(data["score"])
        }
    }
}

const xhr = new XMLHttpRequest();
getScore()
setInterval(getScore, 60000)