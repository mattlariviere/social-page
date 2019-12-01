using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.People;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Sabio.Services
{
    public class PeopleService : IPeopleService
    {

        IDataProvider _data = null;
        public PeopleService(IDataProvider data)
        {
            _data = data;
        }

        public List<People> GetTop()
        {
            List<People> list = null;

            string procName = "[dbo].[People_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: null, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                People person = MapPerson(reader);

                if (list == null)
                {
                    list = new List<People>();
                }
                list.Add(person);

            }
            );


            return list;
        }

        public List<Skills> GetSkills()
        {
            List<Skills> list = null;

            string procName = "dbo.Skills_Select";

            _data.ExecuteCmd(procName, inputParamMapper: null, singleRecordMapper: delegate (IDataReader reader, short set)
            {

                Skills skill = MapSkill(reader);

                if (list == null)
                {
                    list = new List<Skills>();
                }
                list.Add(skill);
            });
            return list;

        }
        public People GetById(int Id)
        {
            string procName = "[dbo].[People_SelectPeopleById]";
            People person = null;


            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", Id);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
             {
                 person = MapPerson(reader);

             });
            return person;
        }

        public Paged<People> GetByIndex(int pageIndex, int pageSize)
        {
            Paged<People> pagedResult = null;
            List<People> indexedPeople = null;
            string procName = "[dbo].[People_SelectPagination]";
            int totalCount = 0;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@pageIndex", pageIndex);
                paramCollection.AddWithValue("@pageSize", pageSize);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                indexedPeople = MapByIndex(reader, ref indexedPeople, ref totalCount);
            }
            );
            if (indexedPeople != null)
            {
                pagedResult = new Paged<People>(indexedPeople, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }

        public Paged<People> GetBySearch(int pageIndex, int pageSize, string query)
        {
            Paged<People> pagedResult = null;
            List<People> indexedPeople = null;
            string procName = "[dbo].[People_SelectBySearch]";
            int totalCount = 0;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@Query", query);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                indexedPeople = MapByIndex(reader, ref indexedPeople, ref totalCount);
            }
            );
            if (indexedPeople != null)
            {
                pagedResult = new Paged<People>(indexedPeople, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }

        public int Add(PersonAddRequest model, int currentUserId)
        {
            int id = 0;

            string procName = "[dbo].[People_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);

                if (model.Skills.Count > 0)
                {
                    DataTable dt = new DataTable();
                    dt.Columns.Add("SkillsId", typeof(int));
                    foreach (int item in model.Skills)
                    {
                        dt.Rows.Add(item);
                    }
                    col.AddWithValue("@PeopleSkillsList", dt);
                }

                SqlParameter IdOut = new SqlParameter("@Id", SqlDbType.Int);
                IdOut.Direction = ParameterDirection.Output;

                col.Add(IdOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {

                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);

            });

            return id;
        }

        public void Update(PersonUpdateRequest model, int currentUserId)
        {
            string procName = "[dbo].[People_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@Id", model.Id);

                if(model.Skills.Count > 0)
                {

                    DataTable dt = new DataTable();
                    dt.Columns.Add("SkillsId", typeof(int));

                    foreach (int item in model.Skills)
                    {
                        dt.Rows.Add(item);
                    }
                    col.AddWithValue("@PeopleSkillsList", dt);
                }

            }, returnParameters: null);
        }

        public void Delete(int Id)
        {

            string procName = "[dbo].[People_DeleteById]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", Id);
            }, returnParameters: null
            );
        }

        private static void AddCommonParams(PersonAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@UserId", model.UserId);
            col.AddWithValue("@Title", model.Title);
            col.AddWithValue("@Bio", model.Bio);
            col.AddWithValue("@Summary", model.Summary);
            col.AddWithValue("@Headline", model.Headline);
            col.AddWithValue("@Slug", model.Slug);
            col.AddWithValue("@StatusId", model.StatusId);
            col.AddWithValue("@PrimaryImage", model.PrimaryImage);
        }

        private static People MapPerson(IDataReader reader)
        {
            People person = new People();
            int index = 0;

            person.Id = reader.GetSafeInt32(index++);
            person.DateAdded = reader.GetDateTime(index++);
            person.DateModified = reader.GetDateTime(index++);
            person.UserId = reader.GetSafeString(index++);
            person.Title = reader.GetString(index++);
            person.Bio = reader.GetString(index++);
            person.Summary = reader.GetString(index++);
            person.Headline = reader.GetString(index++);
            person.Slug = reader.GetString(index++);
            person.StatusId = reader.GetSafeBool(index++);
            person.PrimaryImage = reader.GetSafeString(index++);


            return person;
        }
        private static Skills MapSkill(IDataReader reader)
        {
            Skills skill = new Skills();
            int index = 0;

            skill.Id = reader.GetSafeInt32(index++);
            skill.Name = reader.GetString(index++);

            return skill;
        }
        private static List<People> MapByIndex(IDataReader reader, ref List<People> indexedPeople, ref int totalCount)
        {
            People person = new People();
            int index = 0;
            person.Id = reader.GetSafeInt32(index++);
            person.DateAdded = reader.GetDateTime(index++);
            person.DateModified = reader.GetDateTime(index++);
            person.UserId = reader.GetSafeString(index++);
            person.Title = reader.GetString(index++);
            person.Bio = reader.GetString(index++);
            person.Summary = reader.GetString(index++);
            person.Headline = reader.GetString(index++);
            person.Slug = reader.GetString(index++);
            person.StatusId = reader.GetSafeBool(index++);
            person.PrimaryImage = reader.GetSafeString(index++);
            string skills = reader.GetSafeString(index++);

            if (person.Skills == null)
            {
                person.Skills = new List<Skills>();
            }
            if (skills != null)
            {
                person.Skills = JsonConvert.DeserializeObject<List<Skills>>(skills);
            }

            if (totalCount == 0)
            {
                totalCount = reader.GetSafeInt32(index++);

            }

            if (indexedPeople == null)
            {
                indexedPeople = new List<People>();
            }
            indexedPeople.Add(person);

            return indexedPeople;
        }
    }
}
