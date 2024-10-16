// require("dotenv").config();
// const amqplib = require("amqplib");

// let channel: any;

// const RABBITMQ_URL = process.env.RABBITMQ_URL!;
// const RABBITMQ_QUEUE = process.env.RABBITMQ_QUEUE!;

// async function connectToRabbitMQConsumer(): Promise<any> {
//   if (channel) return channel;

//   const connection = await amqplib.connect(RABBITMQ_URL);
//   channel = await connection.createChannel();
//   await channel.assertQueue(RABBITMQ_QUEUE, { durable: true });

//   console.log("Connected to RabbitMQ and Queue asserted.");
//   return channel;
// }

async function consumeEmails() {
  try {
    // const channel = await connectToRabbitMQConsumer();
    // channel.consume(
    //   RABBITMQ_QUEUE,
    //   async (msg: any) => {
    //     if (msg !== null) {
    //       try {
    //         const emailTask = JSON.parse(msg.content.toString());
    //         console.log("Received Email Task:", emailTask);
    //         // Process the email task here...
    //         channel.ack(msg);
    //       } catch (error) {
    //         console.error("Failed to process message:", error);
    //         channel.nack(msg, false, false);
    //       }
    //     } else {
    //       console.warn("Received null message.");
    //     }
    //   },
    //   { noAck: false }
    // );
    console.log("Waiting for email tasks...");
  } catch (error) {
    console.error("Failed to consume emails:", error);
    process.exit(1);
  }
}

consumeEmails().catch((error) => console.error("Worker Error:", error));
module.exports = consumeEmails;
