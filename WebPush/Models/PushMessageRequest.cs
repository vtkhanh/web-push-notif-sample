namespace WebPush.Models
{
    public class PushMessageRequest
    {
        public Subscription Subscription { get; set; }

        public string Payload {get; set;}
    }
}