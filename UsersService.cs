using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Users;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class UsersService : IUsersService
    {
        IDataProvider _data = null;

        public UsersService(IDataProvider data)
        {
            _data = data;
        }

        public List<User> GetTop()
        {
            List<User> list = null;

            string procName = "[dbo].[Users_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: null, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                User user = MapUser(reader);

                if (list == null)
                {
                    list = new List<User>();
                }
                list.Add(user);
            }
            );


            return list;
        }

        public Paged<User> GetByIndex(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Users_SelectPagination]";
            Paged<User> pagedResult = null;
            List<User> indexedUsers = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@pageIndex", pageIndex);
                paramCollection.AddWithValue("@pageSize", pageSize);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                User user = new User();
                int startingIndex = 0;
                user.Id = reader.GetSafeInt32(startingIndex++);
                user.DateAdded = reader.GetDateTime(startingIndex++);
                user.DateModified = reader.GetDateTime(startingIndex++);
                user.UserId = reader.GetSafeString(startingIndex++);
                user.FirstName = reader.GetSafeString(startingIndex++);
                user.LastName = reader.GetSafeString(startingIndex++);
                user.Email = reader.GetSafeString(startingIndex++);
                user.Password = reader.GetSafeString(startingIndex++);
                user.PasswordConfirm = reader.GetSafeString(startingIndex++);
                if(totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (indexedUsers == null)
                {
                    indexedUsers = new List<User>();
                }
                indexedUsers.Add(user);
            });
            if(indexedUsers != null)
            {
                pagedResult = new Paged<User>(indexedUsers, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public User GetById(int Id)
        {
            string procName = "[dbo].[Users_SelectById]";
            User user = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", Id);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                user = MapUser(reader);
            });


            return user;
        }

        public User GetByEmail(string Email)
        {
            string procName = "[dbo].[Users_SelectByEmail]";
            User user = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Email", Email);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                user = MapUser(reader);
            });

            return user;
        }

        public int Add(UserAddRequest model, int currentUserId)
        {
            int Id = 0;

            string procName = "[dbo].[Users_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);

                SqlParameter IdOut = new SqlParameter("@Id", SqlDbType.Int);
                IdOut.Direction = ParameterDirection.Output;

                col.Add(IdOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
             {
                 object oId = returnCollection["@Id"].Value;
                 int.TryParse(oId.ToString(), out Id);
             });
            return Id;
        }

        public void Update(UserUpdateRequest model, int currentUserId)
        {
            string procName = "[dbo].[Users_Update]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@Id", model.Id);
            }, returnParameters: null
            );
        }

        public void Delete(int Id)
        {
            string procName = "[dbo].[Users_DeleteById]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", Id);
            }, returnParameters: null
            );
        }
        private static void AddCommonParams(UserAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@UserId", model.UserId);
            col.AddWithValue("@FirstName", model.FirstName);
            col.AddWithValue("@LastName", model.LastName);
            col.AddWithValue("@Email", model.Email);
            col.AddWithValue("@Password", model.Password);
            col.AddWithValue("@PasswordConfirm", model.PasswordConfirm);
        }

        private static User MapUser(IDataReader reader)
        {
            User user = new User();
            int startingIndex = 0;

            user.Id = reader.GetSafeInt32(startingIndex++);
            user.DateAdded = reader.GetDateTime(startingIndex++);
            user.DateModified = reader.GetDateTime(startingIndex++);
            user.UserId = reader.GetSafeString(startingIndex++);
            user.FirstName = reader.GetSafeString(startingIndex++);
            user.LastName = reader.GetSafeString(startingIndex++);
            user.Email = reader.GetSafeString(startingIndex++);
            user.Password = reader.GetSafeString(startingIndex++);
            user.PasswordConfirm = reader.GetSafeString(startingIndex++);
            return user;
        }

    }
}
