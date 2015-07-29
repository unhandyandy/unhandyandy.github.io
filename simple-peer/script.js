var Peer = window.SimplePeer
var p = new Peer({ initiator: location.hash === '#1', trickle: false })
var invitation = ""

p.on('error', function (err) { console.log('error', err) })

function sendMail() {
    var link = "mailto:" + escape(document.getElementById('incoming').value) +
               "?subject=" + escape("Game Invitation") +
               "&body=" + JSON.stringify(invitation);
    window.location.href = link; }

p.on('signal', function (data) {
  invitation = JSON.stringify(data)
  console.log('SIGNAL', invitation)
})

document.addEventListener('paste', function(e){
    p.signal(JSON.parse(e.clipboardData.getData('text/plain')))
})

document.querySelector('form').addEventListener('submit', function (ev) {
  ev.preventDefault()
  sendMail()
})

document.querySelector('#type').addEventListener('keypress', function (ev) {
  if ( ev.keyCode === 13 ){ 
    var ta = document.querySelector('#type')
    var text = ta.value
    ta.value = ""
    document.querySelector('#thread').value += "\n\n" + text
    p.send(text) }
})

p.on('connect', function () {
  console.log('CONNECT')
})

p.on('data', function (data) {
  console.log('data: ' + data)
  document.querySelector('#thread').innerHTML += "<br/><br/>" + data
})
