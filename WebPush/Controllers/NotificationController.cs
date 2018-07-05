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
        private readonly VapidDetails _vapidDetails;

        public NotificationController(IConfiguration configuration)
        {
            _publicKey = configuration["VapidKeys:PublicKey"];
            _privateKey = configuration["VapidKeys:PrivateKey"];
            _vapidDetails = new VapidDetails("mailto:kvu@amaris.com", _publicKey, _privateKey);
        }

        [Route("ServerPublicKey")]
        [HttpGet()]
        public JsonResult ServerPublicKey()
        {
            var result = new {
                key = _publicKey
            };
            return Json(result);
        }

        [Route("PushMessage")]
        [HttpPost()]
        public JsonResult PushMessage(PushMessageRequest request)
        {
            return Json(new { request.Subscription, request.Message });
        }
    }
}