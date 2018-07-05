using System;

namespace WebPush.Models
{
    public class Subscription
    {
        public string Endpoint {get;set;}

        public DateTime? ExpirationTime {get;set;}

        public Keys Keys {get;set;}
        
    }
}