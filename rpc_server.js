var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  if (err) {
    console.log(err)
  }
  conn.createChannel(function (err, ch) {
    if (err) {
      console.log(err)
    }
    var q = 'task_queue';

    ch.assertQueue(q, { durable: true })
    ch.prefetch(1)
    console.log(' [x] Awaiting RPC requests')
    ch.consume(q, function reply (msg) {
      console.log('corr: ' + msg.properties.correlationId)
      console.log('rep: ' + msg.properties.replyTo)
      var n = parseInt(msg.content.toString());

      console.log(' [.] sq(%d)', n);

      var r = square(n)

      ch.sendToQueue(msg.properties.replyTo,
        new Buffer(r.toString()),
        { correlationId: 'wkwkwk' })

      ch.ack(msg)
    })
  })
})

function square (n) {
  return n * n
}