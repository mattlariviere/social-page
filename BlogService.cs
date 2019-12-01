using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Blogs;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services.Security
{
    public class BlogService : IBlogService
    {
        IDataProvider _data = null;
        public BlogService(IDataProvider data)
        {
            _data = data;
        }

        public Paged<Blogs> GetByIndex(int pageIndex, int pageSize)
        {
            Paged<Blogs> pagedResult = null;
            List<Blogs> indexedBlogs = null;
            string procName = "[dbo].[Blogs_SelectByIndex]";
            int totalCount = 0;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@pageIndex", pageIndex);
                paramCollection.AddWithValue("@pageSize", pageSize);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {

                indexedBlogs = MapBlogsByIndex(reader, ref indexedBlogs, ref totalCount);
            }
            );
            if (indexedBlogs != null)
            {
                pagedResult = new Paged<Blogs>(indexedBlogs, pageIndex, pageSize, totalCount);
            }
            return pagedResult;

        }

        public Paged<Blogs> GetPageBySearch(int pageIndex, int pageSize, string query)
        {
            string procName = "[dbo].[Blogs_SelectBySearch]";
            int totalCount = 0;
            Paged<Blogs> pagedResult = null;
            List<Blogs> indexedBlogs = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@Query", query);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                indexedBlogs = MapBlogsByIndex(reader, ref indexedBlogs, ref totalCount);

                if (indexedBlogs != null)
                {
                    pagedResult = new Paged<Blogs>(indexedBlogs, pageIndex, pageSize, totalCount);
                }

            });
            return pagedResult;
        }

        public int Add(BlogAddRequest model, int currentUserId)
        {
            int Id = 0;

            string procName = "[dbo].[Blogs_Insert]";

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
            }
            );

            return Id;
        }
        public void Update(BlogUpdateRequest model, int currentUserId)
        {
            string procName = "[dbo].[Blogs_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@Id", model.Id);
            }, returnParameters: null
            );
        }

        private static void AddCommonParams(BlogAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@UserId", model.UserId);
            col.AddWithValue("@Title", model.Title);
            col.AddWithValue("@ShortTitle", model.ShortTitle);
            col.AddWithValue("@Content", model.Content);
            col.AddWithValue("@ShortDescription", model.ShortDescription);
            col.AddWithValue("@Slug", model.Slug);
            col.AddWithValue("@StatusId", model.StatusId);
            col.AddWithValue("@PrimaryImage", model.PrimaryImage);
            col.AddWithValue("@Tags", model.Tags);
        }

        private static List<Blogs> MapBlogsByIndex(IDataReader reader, ref List<Blogs> indexedBlogs, ref int totalCount)
        {
            Blogs blog = new Blogs();
            int index = 0;

            blog.Id = reader.GetSafeInt32(index++);
            blog.DateAdded = reader.GetDateTime(index++);
            blog.DateModified = reader.GetDateTime(index++);
            blog.UserId = reader.GetString(index++);
            blog.Title = reader.GetString(index++);
            blog.ShortTitle = reader.GetString(index++);
            blog.Content = reader.GetString(index++);
            blog.ShortDescription = reader.GetString(index++);
            blog.Slug = reader.GetString(index++);
            blog.StatusId = reader.GetSafeBool(index++);
            blog.PrimaryImage = reader.GetString(index++);
            blog.Tags = reader.GetString(index++);
            totalCount = reader.GetSafeInt32(index++);

            if (indexedBlogs == null)
            {
                indexedBlogs = new List<Blogs>();

            }
            else
            {
                indexedBlogs.Add(blog);
            }
            return indexedBlogs;
        }
    }
}
