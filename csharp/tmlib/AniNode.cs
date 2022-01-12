using AniTask.MQ;
using Newtonsoft.Json;
using System;


namespace AniTask
{
    public enum NodeState
    {
        Idle,
        Busy,
        Dead,
    }

    class AniNodeStatus
    {
        public string nodeId;
        public string type;
        public string desc;
        public string machineName;
        public string machineIP;
        public string rpcQueue;
        public NodeState state;
        public string stateDesc;
        public double createdAt;  //utc timestamp in seconds
    }

    public abstract class AniNode
    {
        public readonly string uuid;
        private BroadcastSender heartBeatChannel;
        private RPCServer rpcServer;
        protected DateTime createdAt;
        private System.Timers.Timer heartBeatTimer;
        protected NodeState state = NodeState.Idle;
        protected string stateDesc = "";

        public AniNode()
        {
            this.uuid = Utils.GenId();
            this.createdAt = DateTime.Now;
        }

        public abstract string GetNodeType();
        public virtual string GetDesc() { return ""; }

        protected void Start(string statusQueue)
        {
            this.heartBeatChannel = new BroadcastSender(Config.MQ_SERVER, Config.NODE_HEARTBEAT_CHANNEL);
            this.heartBeatTimer = Interval.Set(() => { ReportStatus(); }, Config.NODE_HEARTBEAT_INTERVAL);
            this.rpcServer = new RPCServer();
        }
        public virtual void Stop()
        {
            this.UpdateStatus(NodeState.Dead);
            Interval.Stop(this.heartBeatTimer);
            this.heartBeatTimer = null;
            this.heartBeatChannel?.Close();
            this.heartBeatChannel = null;
        }

        public void UpdateStatus(NodeState state, string stateDesc = "", bool report = true)
        {
            this.state = state;
            this.stateDesc = stateDesc;
            if(report)ReportStatus();
        }

        protected void ReportStatus()
        {
            var status = new AniNodeStatus
            {
                nodeId = this.uuid,
                desc = this.GetDesc(),
                type = GetNodeType(),
                machineName = Environment.MachineName,
                machineIP = Utils.GetLocalIP(),
                state = this.state,
                createdAt = Utils.ToUnixTimeStamp(this.createdAt),
                stateDesc = this.stateDesc
            };
            var msg = JsonConvert.SerializeObject(status);
            this.heartBeatChannel.Send(msg);
        }
    }
}
