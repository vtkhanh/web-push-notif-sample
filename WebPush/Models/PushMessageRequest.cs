namespace WebPush.Models
{
    public class PushMessageRequest
    {
        public Subscription Subscription { get; set; }

        public string Title { get; set; }

        public string Message { get; set; }

    }
}