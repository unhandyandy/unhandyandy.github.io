var Peer = window.SimplePeer
var p = new Peer({ initiator: location.hash === '#1', trickle: false })
var invitation = ""
var stage = 0

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
document.querySelector('#incoming').addEventListener('input', function (ev) {
  stage = 0
})
document.querySelector('form').addEventListener('submit', function (ev) {
  ev.preventDefault()
  if (stage === 0 ){
      if ( invitation === "" ){
          p.signal(JSON.parse(window.clipboardData.getData('Text')))
          stage = 2}
      else{
          sendMail()
          stage = 3 } }
  else if ( stage === 2){
      sendMail()}
  else{
      p.signal(JSON.parse(window.clipboardData.getData('Text'))) }
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
