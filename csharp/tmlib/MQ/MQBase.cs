using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AniTask.MQ
{
    public class MQConnection
    {
        IConnection conn;
        public IModel ch;
        public bool Open(string url)
        {
            try
            {
                var factory = new ConnectionFactory() { Uri = new Uri(url) };
                var connection = factory.CreateConnection();
                var channel = connection.CreateModel();
                this.conn = connection;
                this.ch = channel;
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception {0}", e.ToString());
                return false;
            }
        }
        public void Close()
        {
            this.ch?.Close();
            this.ch = null;
            this.conn?.Close();
            this.conn = null;
        }
        public bool IsValid()
        {
            return this.ch != null && this.conn != null;
        }
    }

    public class MQBase
    {
        protected MQConnection connection;
        bool ownConnection;
        public MQBase(string url)
        {
            this.connection = new MQConnection();
            this.connection.Open(url);
            this.ownConnection = true;
        }
        public MQBase(MQConnection conn)
        {
            this.connection = conn;
            this.ownConnection = false;
        }
        public void Close()
        {
            if (this.ownConnection)
            {
                this.connection.Close();
                this.connection = null;
            }
        }
    }
}
