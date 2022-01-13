using RabbitMQ.Client.Events;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AniTask.MQ
{
  public class RPCBase : MQBase
  {
    public RPCBase(string url) : base(url) { }
    public string AssertServerQueue(string queue)
    {
      var queueOK = connection.ch.QueueDeclare(queue,
                           durable: false,
                           exclusive: false,
                           autoDelete: false,
                           arguments: null);

      return queueOK.QueueName;
    }

    public string AssertClientQueue()
    {
      return connection.ch.QueueDeclare("", durable: false,
                           exclusive: true,
                           autoDelete: false,
                           arguments: null).QueueName;
    }
  }


  public class RPCServer : RPCBase
  {
    public string queue { get; }
    public delegate string Handler(string msg);

    public RPCServer(string url) : base(url)
    {
      this.queue = this.AssertServerQueue("rpc_server_" + Utils.GUID());
    }

    public bool Run(Handler handler)
    {
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
 
        var result = handler.Invoke(message);
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


  public class RPCClient : RPCBase
  {
    protected string replyQueueName;
    private EventingBasicConsumer consumer;
    private readonly BlockingCollection<string> respQueue = new BlockingCollection<string>();
    string correlationId;
    public RPCClient(string url):base(url)
    {
      this.replyQueueName = AssertClientQueue();
      this.Run();
    }

    private void Run()
    {
      var channel = this.connection.ch;
      consumer = new EventingBasicConsumer(channel);
      consumer.Received += (model, ea) =>
      {
        var body = ea.Body.ToArray();
        var response = Encoding.UTF8.GetString(body);
        if (ea.BasicProperties.CorrelationId == correlationId)
        {
          respQueue.Add(response);
        }
      };
      channel.BasicConsume(
          consumer: consumer,
          queue: replyQueueName,
          consumerTag: "",
          noLocal: false,
          exclusive: false,
          arguments: null,
          autoAck: true);
    }

    public string Call(string message, string serverQueue)
    {
      correlationId = Guid.NewGuid().ToString();
      var channel = this.connection.ch;
      var props = channel.CreateBasicProperties();
      props.CorrelationId = correlationId;
      props.ReplyTo = replyQueueName;

      var messageBytes = Encoding.UTF8.GetBytes(message);
      channel.BasicPublish(
          exchange: "",
          routingKey: serverQueue,
          mandatory: false,
          basicProperties: props,
          body: messageBytes);
      return respQueue.Take();
    }
  }
}
