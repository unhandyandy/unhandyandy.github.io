var Peer = window.SimplePeer
var p = new Peer({ initiator: location.hash === '#1', trickle: false })

p.on('error', function (err) { console.log('error', err) })

p.on('signal', function (data) {
  console.log('SIGNAL', JSON.stringify(data))
  document.querySelector('#outgoing').textContent = JSON.stringify(data)
})

document.querySelector('form').addEventListener('submit', function (ev) {
  ev.preventDefault()
  p.signal(JSON.parse(document.querySelector('#incoming').value))
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
  document.querySelector('#thread').value += "\n\n" + data
})
