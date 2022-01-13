using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AniTask.MQ
{
  public class RPCBase: MQBase
  {
    public string AssertServerQueue(string queue)
    {
      var queueOK = connection.ch.QueueDeclare(this.queue,
                           durable: false,
                           exclusive: false,
                           autoDelete: false,
                           arguments: null);

      this.queue = queueOK.QueueName;
      return true;
    }

    public string AssertClientQueue(string queue)
    {

    }
  }


  public class RPCServer : RPCBase
  {
    protected string queue;
    public delegate string Handler(string msg);
    Handler handler;

    public RPCServer(string url, string qName) : base(url)
    {
      this.queue = qName;
      this.Run();
    }

    private bool Run()
    {
      if (!this.AssertQueue()) return false;
      var channel = this.connection.ch;
      channel.BasicQos(0, 1, false);

      var consumer = new EventingBasicConsumer(channel);
      channel.BasicConsume(queue: this.queue,
        consumerTag: "",
        noLocal:false,
        exclusive:false,
        arguments:null,
        autoAck: false,
        consumer: consumer);
      Console.WriteLine(" [x] Awaiting RPC requests");
      consumer.Received += (model, ea) =>
      {
        string response = null;

        var body = ea.Body.ToArray();
        var props = ea.BasicProperties;
        var replyProps = channel.CreateBasicProperties();
        replyProps.CorrelationId = props.CorrelationId;
        var message = Encoding.UTF8.GetString(body);
        channel.BasicAck(deliveryTag: ea.DeliveryTag,
          multiple: false);
 
        var result = this.handler.Invoke(message);
        var responseBytes = Encoding.UTF8.GetBytes(response);
        channel.BasicPublish(exchange: "",
          routingKey: props.ReplyTo,
          mandatory: false,
          basicProperties: replyProps,
          body: responseBytes);
      };
      return true;
    }
  }


  public class RPCClient : MQBase
  {
    public RPCClient(string url):base(url)
    {
      this.serverQueue = serverQueue;
      this.Run();
    }

    private bool Run()
    {
      if(!this.isva)
    }
  }
}
