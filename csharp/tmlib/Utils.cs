using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace AniTask
{
    public static class Utils
    {
        public static double ToUnixTimeStamp(DateTime t)
        {
            return (t.ToUniversalTime().Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
        }
        public static DateTime FromUnixTimeStamp(double s)
        {
            DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeMilliseconds((long)(s * 1000));
            return dateTimeOffset.DateTime;
        }
        public static string GenId()
        {
            return System.Guid.NewGuid().ToString();
        }
        public static double Now()
        {
            return ToUnixTimeStamp(DateTime.Now);
        }
        public static string GetLocalIP()
        {
            string hostName = Dns.GetHostName(); // Retrieve the Name of HOST
            // Get the IP
            var addressList = Dns.GetHostEntry(hostName).AddressList;
            if(addressList.Count() > 0)
            {
                return addressList[0].MapToIPv4().ToString();
            }
            return "";
        }
    }

    public static class Interval
    {
        public static System.Timers.Timer Set(Action action, TimeSpan interval)
        {
            var timer = new System.Timers.Timer(interval.TotalMilliseconds);
            timer.Elapsed += (s, e) =>
            {
                timer.Enabled = false;
                action();
                timer.Enabled = true;
            };
            timer.Enabled = true;
            return timer;
        }

        public static void Stop(System.Timers.Timer timer)
        {
            timer?.Stop();
            timer?.Dispose();
        }
    }
}
