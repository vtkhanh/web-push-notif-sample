using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using WebPush.Models;
using WebPush;

namespace WebPush.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : Controller
    {
        private readonly string _publicKey;
        private readonly string _privateKey;

        public NotificationController(IConfiguration configuration)
        {
            _publicKey = configuration["VapidKeys:PublicKey"];
            _privateKey = configuration["VapidKeys:PrivateKey"];
        }

        [Route("ServerPublicKey")]
        [HttpGet()]
        public JsonResult ServerPublicKey()
        {
            return Json(new { key = _publicKey });
        }

        [Route("PushMessage")]
        [HttpPost()]
        public JsonResult PushMessage(PushMessageRequest request)
        {
            try
            {
                var webPushClient = new WebPushClient();
                var subscription = new PushSubscription(request.Subscription.Endpoint,
                    request.Subscription.Keys.P256dh, request.Subscription.Keys.Auth);
                var vapidDetails = new VapidDetails("mailto:kvu@amaris.com", _publicKey, _privateKey);

                // STEP 5: Send PushMessage to Push Service
                webPushClient.SendNotification(subscription, request.Payload, vapidDetails);
            }
            catch (WebPushException exception)
            {
                return Json(new { Ok = false, Error = $"HTTP status code: {exception.StatusCode}" });
            }
            return Json(new { Ok = true });
        }
    }
}