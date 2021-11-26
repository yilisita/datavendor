const notice = document.getElementById('notice')
const username = document.getElementById('username')
const id = document.getElementById('id')
const amount = document.getElementById('amount')
const currentRole = document.getElementById('current-role')
const vender = document.getElementById('vender')
const buyer = document.getElementById('buyer')

const port = '4000';

function onLogin() {
    fetch('http://localhost:'+ port +'/login/in')
        .then(response => {
            return response.text();
        })
        .then(text => {
            alert(text);
        })

}


function onCreate() {
    console.log(username.value, id.value, amount.value)
    fetch(`http://localhost:4000/create?username=${username.value}&id=${id.value}&amount=${amount.value}`)
        .then(response => {
            // console.log(response)
            return response.text()
        })
        .then(text => {
            alert(text);
            //notice.innerHTML = text
        })
}

function onHandle() {
    fetch('http://localhost:4000/handle')
        .then(response => {
            // console.log(response)
            return response.text()
        })
        .then(text => {
            var table_str = "<table><caption>交易记录</caption><thead><tr><td>编号</td><td>请求</td><td>请求时间</td><td>查询结果</td></tr></thead><tbody>";
            for (var data in text){
                var temp = text[data];
                var row_str = '<tr>';
                for (var key in temp){
                    row_str += '<td>' + temp[key] + '</td>';
                }
                row_str += '</tr>';
                table_str += row_str;
            }
            table_str += '</tbody>'
            document.getElementById("notice").innerHTML = table_str;
        })
}


function changeRole(e) {
    console.log(e.target.checked)
    const checked = e.target.checked
    if (checked) {
        currentRole.innerHTML = `Current role: Buyer`
    } else {
        currentRole.innerHTML = `Current role: Vender`
    }
    vender.classList.toggle('hidden')
    buyer.classList.toggle('hidden')
}


function sendRequest() {
    fetch('http://localhost:3000/sendRequest')
        .then(response => {
            // console.log(response)
            return response.text()
        })
        .then(text => {
            alert(text)
            //notice2.innerHTML = text
        })
}

function readResponse() {
    fetch('http://localhost:3000/readResponse')
        .then(response => {
            // console.log(response)
            return response.text()
        })
        .then(text => {
            // alert(text)
            var table_str = "<table><caption>交易记录</caption><thead><tr><td>编号</td><td>请求</td><td>请求时间</td><td>查询结果</td></tr></thead><tbody>";
            for (var data in text){
                var temp = text[data];
                var row_str = '<tr>';
                for (var key in temp){
                    row_str += '<td>' + temp[key] + '</td>';
                }
                row_str += '</tr>';
                table_str += row_str;
            }
            table_str += '</tbody>'
            document.getElementById("notice2").innerHTML = table_str;
            }
        )
}
