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
using Sabio.Models.Requests.People;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/people")]
    [ApiController]

    public class PeopleAPIController : BaseApiController
    {
        private IPeopleService _service = null;
        private IAuthenticationService<int> _authService = null;

        public PeopleAPIController(IPeopleService service,
            ILogger<PeopleAPIController> logger,
            IAuthenticationService<int> authenticationService) : base(logger)
        {
            _service = service;
            _authService = authenticationService;
        }
         
        [HttpGet]
        public ActionResult<ItemsResponse<People>> GetAll()
        {

            int code = 200;

            BaseResponse response = null;

            try
            {
                List<People> list = _service.GetTop();

                if (list == null)
                {
                    code = 404;

                    response = new ErrorResponse("Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<People> { Items = list };
                }

            }
            catch(Exception ex)
            {
                code = 500;

                response = new ErrorResponse(ex.Message);
            }

             return StatusCode(code, response);

        }
        
        [HttpGet("pageIndex={pageIndex:int}&pageSize={pageSize:int}")]
        public ActionResult<ItemResponse<Paged<People>>> GetPage(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<People> page = _service.GetByIndex(pageIndex, pageSize);
                if(page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<People>> { Item = page };
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

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<People>> GetById(int Id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                People person = _service.GetById(Id);

                if (person == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Resource not found");
                }
                else
                {
                    response = new ItemResponse<People>{ Item = person };
                }
            }

             catch (SqlException sqlEx)
            {
                iCode = 500;
                response = new ErrorResponse($"SqlException Error: ${sqlEx.Message}");
                base.Logger.LogError(sqlEx.ToString());


            }
            catch (ArgumentException argEx)
            {
                iCode = 500;

                response = new ErrorResponse($"ArgumentException Error: ${argEx.Message}");
            }

            catch (Exception ex)
            {
                iCode = 500;

                base.Logger.LogError(ex.ToString());

                response = new ErrorResponse($"Generic Error: ${ex.Message}");

            }

            return StatusCode(iCode, response);

        }
        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<People>>> GetBySearch(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<People> page = _service.GetBySearch(pageIndex, pageSize, query);
                if(page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<People>> { Item = page };
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
        [HttpGet("skills")]
        public ActionResult<ItemsResponse<Skills>> GetSkills()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
               List<Skills> skills = _service.GetSkills();

                if(skills == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemsResponse<Skills> { Items = skills };
                }
            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
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
        public ActionResult<ItemResponse<int>> Create(PersonAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int currentUserId = _authService.GetCurrentUserId();

                int Id = _service.Add(model, currentUserId);

                ItemResponse<int> response = new ItemResponse<int>() { Item = Id};

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

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(PersonUpdateRequest model)
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


            return StatusCode(code,response);

        }

        [HttpPut("{id:int}/{statusId:int}")]
        public ActionResult<SuccessResponse> UpdateStatusId(PersonUpdateRequest model)
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