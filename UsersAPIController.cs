using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Users;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/users")]
    [ApiController]

    public class UsersAPIController : BaseApiController
    {
       private IUsersService _service = null;
        private IAuthenticationService<int> _authService = null;
        public UsersAPIController(IUsersService service
            ,ILogger<UsersAPIController> logger
            ,IAuthenticationService<int> authenticationService) : base(logger)
        {
            _service = service;
            _authService = authenticationService;
        }

        [HttpGet]
        public ActionResult<ItemsResponse<User>> GetAll()
        {

            int code = 200;
            BaseResponse response = null;

            try
            {
                List<User> list = _service.GetTop();

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Response not found.");

                }
                else
                {
                    response = new ItemsResponse<User> { Items = list };
                }
            }
            catch (Exception ex)
            {

                code = 500;
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);

        }
        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<User>> GetById(int Id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                User user = _service.GetById(Id);

                if (user == null)
                {
                    code = 404;
                    response = new ErrorResponse("Resource not found.");
                }
                else
                {
                    response = new ItemResponse<User> { Item = user };
                }
            }
            catch (SqlException sqlEx)
            {

                code = 500;
                response = new ErrorResponse($"SqlException Error: ${sqlEx.Message}");
                base.Logger.LogError(sqlEx.ToString());
            }
            catch(ArgumentException argEx)
            {
                code = 500;
                response = new ErrorResponse($"ArgumentException Error: ${argEx.Message}");
            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: ${ex.Message}");
            }
            return StatusCode(code, response);
        }
        [HttpGet("pageIndex={pageIndex:int}&pageSize={pageSize:int}")]
        public ActionResult<ItemResponse<Paged<User>>> GetByIndex(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<User> page = _service.GetByIndex(pageIndex, pageSize);
                if(page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<User>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());

            }
            return StatusCode(code, response);
        }
        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int Id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Delete(Id);

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }
        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(UserAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int currentUserId = _authService.GetCurrentUserId();

                int Id = _service.Add(model, currentUserId);

                ItemResponse<int> response = new ItemResponse<int> { Item = Id };

                result = Created201(response);

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }
        [HttpPost("login")]
        public ActionResult<ItemResponse<User>> CreateLogin(UserLoginAddRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int currentUserId = _authService.GetCurrentUserId();

                string email = model.Email;
                string password = model.Password;

               User user = _service.GetByEmail(email);

                if (user == null)
                {
                    code = 404;
                    response = new ErrorResponse("Resource not found.");

                }
                else
                {
                    if(password == user.Password)
                    {
                        response = new ItemResponse<User> { Item = user };
                    }
                    else
                    {
                        code = 400;
                        response = new ErrorResponse("Password is in invalid");
                    }
      
                }
            }
            catch (SqlException sqlEx)
            {

                code = 500;
                response = new ErrorResponse($"SqlException Error: ${sqlEx.Message}");
                base.Logger.LogError(sqlEx.ToString());
            }
            catch (ArgumentException argEx)
            {
                code = 500;
                response = new ErrorResponse($"ArgumentException Error: ${argEx.Message}");
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: ${ex.Message}");
            }

            return StatusCode(code, response);
        }
        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(UserUpdateRequest model)
        {

            int code = 200;
            BaseResponse response = null;

            try
            {
                int currentUserId = _authService.GetCurrentUserId();

                _service.Update(model, currentUserId);

                response = new SuccessResponse();
            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);

        }
    }
}