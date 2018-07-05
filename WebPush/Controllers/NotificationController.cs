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
            VapidDetails vapidKeys = VapidHelper.GenerateVapidKeys();
            _publicKey = vapidKeys.PublicKey;
            _privateKey = vapidKeys.PrivateKey;
        }

        [Route("ServerPublicKey")]
        [HttpGet()]
        public JsonResult ServerPublicKey()
        {
            var result = new
            {
                key = _publicKey
            };
            return Json(result);
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
                var vapidDetails = new VapidDetails("mailto:example@example.com", _publicKey, _privateKey);

                webPushClient.SendNotification(subscription, request.Message, vapidDetails);
            }
            catch (WebPushException exception)
            {
                return Json(new { Ok = false, Error = $"HTTP status code: {exception.StatusCode}" });
            }
            return Json(new { Ok = true });
        }
    }
}