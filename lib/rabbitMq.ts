import amqplib from "amqplib";

let channel: amqplib.Channel;

const RABBITMQ_URL = process.env.RABBITMQ_URL!;
const RABBITMQ_QUEUE = process.env.RABBITMQ_QUEUE!;

export async function connectToRabbitMQ(): Promise<amqplib.Channel> {
  if (channel) return channel;

  const connection = await amqplib.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(RABBITMQ_QUEUE, { durable: true });

  console.log("Connected to RabbitMQ and Queue asserted.");
  return channel;
}

export async function publishToQueue(queue: string, message: any) {
  const channel = await connectToRabbitMQ();
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
}
