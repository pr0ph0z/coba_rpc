var amqp = require('amqplib/callback_api')

var args = process.argv.slice(2)

if (args.length === 0) {
  console.log('Usage: rpc_client.js num')
  process.exit(1)
}

amqp.connect('amqp://localhost', function (err, conn) {
  if (err) {
    console.log(err)
  }
  conn.createChannel(function (err, ch) {
    if (err) {
      console.log(err)
    }
    ch.assertQueue('', { exclusive: true, durable: true }, function (err, q) {
      if (err) {
        console.log(err)
      }
      console.log('que: ' + q.queue)
      var num = parseInt(args[0])

      console.log(' [x] Requesting sq(%d)', num)

      ch.consume(q.queue, function (msg) {
        if (msg.properties.correlationId === 'wkwkwk') {
          console.log(' [.] Got %s', msg.content.toString())
          setTimeout(function () { conn.close(); process.exit(0) }, 500)
        }
      }, { noAck: false })

      ch.sendToQueue('task_queue',
      new Buffer(num.toString()),
      { correlationId: 'wkwkwk', replyTo: q.queue });
    })
  })
})