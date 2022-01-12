using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Threading;

namespace AniTask.MQ
{
    public class TaskMQBase : MQBase
    {
        protected string queue;
        public TaskMQBase(string url, string queue): base(url)
        {
            this.queue = queue;
        }
        public TaskMQBase(MQConnection conn, string queue):base(conn)
        {
            this.queue = queue;
        }

        public bool AssertQueue()
        {
            if (!connection.IsValid()) return false;
            var queueOK = connection.ch.QueueDeclare(queue: this.queue,
                                 durable: true,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);

            this.queue = queueOK.QueueName;
            return true;
        }
    }

    public class TaskSender : TaskMQBase
    {
        public TaskSender(MQConnection conn, string queue) : base(conn, queue)
        {
        }
        public TaskSender(string url, string queue):base(url, queue)
        {

        }

        public bool Send(string message)
        {
            if (!this.AssertQueue()) return false;

            var ch = this.connection.ch;
            var body = Encoding.UTF8.GetBytes(message);

            var properties = ch.CreateBasicProperties();
            properties.Persistent = true;

            ch.BasicPublish(exchange: "",
                                 routingKey: this.queue,
                                 basicProperties: properties,
                                 body: body);
            Console.WriteLine(" [x] Sent {0}", message);
            return true;
        }
    }

    public class TaskReceicer : TaskMQBase
    {
        public TaskReceicer(MQConnection conn, string queue) : base(conn, queue)
        {
        }
        public TaskReceicer(string url, string queue):base(url, queue)
        {

        }

        public delegate bool MessageBackDelegate(string url);
        public bool Run(MessageBackDelegate msgBack)
        {
            if (!this.AssertQueue())
            {
                return false;
            }
            var ch = this.connection.ch;
            ch.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);

            Console.WriteLine(" [*] Waiting for messages.");

            var consumer = new EventingBasicConsumer(ch);
            consumer.Received += (sender, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                Console.WriteLine(" [x] Received {0}", message);
                if (msgBack.Invoke(message))
                {
                    ch.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
                }
                else
                {
                    ch.BasicNack(deliveryTag: ea.DeliveryTag, multiple: false, requeue: true);
                }
            };
            ch.BasicConsume(queue: this.queue, autoAck: false, consumer: consumer);
            return true;
        }
    }
}
