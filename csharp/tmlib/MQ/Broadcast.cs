using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace AniTask.MQ
{
    public class BroadcastMQBase : MQBase
    {
        protected string exchange;
        public BroadcastMQBase(string url, string exchange) : base(url)
        {
            this.exchange = exchange;
        }
        public BroadcastMQBase(MQConnection conn, string exchange) : base(conn)
        {
            this.exchange = exchange;
        }

        public bool AssertExchange()
        {
            if (!connection.IsValid()) return false;
            var ch = this.connection.ch;
            ch.ExchangeDeclare(exchange: exchange, type: ExchangeType.Fanout);
            return true;
        }
    }

    public class BroadcastSender : BroadcastMQBase
    {
        public BroadcastSender(string url, string exchange) : base(url, exchange)
        {
        }
        public BroadcastSender(MQConnection conn, string exchange) : base(conn, exchange)
        {
        }

        public void Send(string message)
        {
            if (!this.AssertExchange()) return;
            var body = Encoding.UTF8.GetBytes(message);
            var ch = this.connection.ch;
            ch.BasicPublish(exchange: this.exchange,
                                 routingKey: "",
                                 basicProperties: null,
                                 body: body);
        }
    }

    public class BroadcastRecevier : BroadcastMQBase
    {
        public BroadcastRecevier(MQConnection conn, string exchange) : base(conn, exchange)
        {
        }
        public BroadcastRecevier(string url, string exchange) : base(url, exchange)
        {
        }

        public delegate void MessageCallback(string url);
        public bool Run(MessageCallback msgBack)
        {
            if (!this.AssertExchange()) return false;
            var ch = this.connection.ch;
            var queueName = ch.QueueDeclare().QueueName;
            ch.QueueBind(queue: queueName,
                              exchange: this.exchange,
                              routingKey: "");

            var consumer = new EventingBasicConsumer(this.ch);
            consumer.Received += (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                Console.WriteLine(" [x] Received {0}", message);
                msgBack.Invoke(message);
            };

            ch.BasicConsume(queue: queueName,
                             autoAck: true,
                             consumer: consumer);
            return true;
        }
    }
}
