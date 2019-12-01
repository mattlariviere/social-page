using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Blogs;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/blogs")]
    [ApiController]
    public class BlogsAPIController : BaseApiController
    {
        private IBlogService _service = null;
        private IAuthenticationService<int> _authService = null;
        public BlogsAPIController(IBlogService service, ILogger<BlogsAPIController> logger, IAuthenticationService<int> authenticationService) : base(logger)
        {
            _service = service;
            _authService = authenticationService;
        }

        [HttpGet("pageIndex={pageIndex:int}&pageSize={pageSize:int}")]
        public ActionResult <ItemResponse<Paged<Blogs>>> GetByIndex(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Blogs> page = _service.GetByIndex(pageIndex, pageSize);
                if(page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Blogs>> { Item = page };
                }
            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpGet("search")]
        public ActionResult <ItemResponse<Paged<Blogs>>> GetPageBySearch(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
               Paged<Blogs> page = _service.GetPageBySearch(pageIndex, pageSize, query);

                if(page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");

                }
                else
                {
                    response = new ItemResponse<Paged<Blogs>> { Item = page };
                }
            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpPost]
        public ActionResult <ItemResponse<int>> Create(BlogAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int currentUserId = _authService.GetCurrentUserId();

                int Id = _service.Add(model, currentUserId);

                ItemResponse<int> response = new ItemResponse<int>();

                result = Created201(response);
            }
            catch(Exception ex)
            {
                base.Logger.LogError(ex.ToString());

                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }
        [HttpPut ("{id:int}")]
        public ActionResult <SuccessResponse> Update(BlogUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int currentUserId = _authService.GetCurrentUserId();

                _service.Update(model, currentUserId);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}/{statusId:int}")]
        public ActionResult <SuccessResponse> UpdateStatus(BlogUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int currentUserId = _authService.GetCurrentUserId();

                _service.Update(model, currentUserId);

                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }
    }
}