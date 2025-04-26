import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:8080/api/v1/course";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),

  // Mutation is for sending data, and query is for receiving data.
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "/",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    getSearchCourse:builder.query({
      query: ({searchQuery, categories, sortByPrice}) => {
        // Build qiery string
        let queryString = `/search?query=${encodeURIComponent(searchQuery)}`

        // append cateogry 
        if(categories && categories.length > 0) {
          const categoriesString = categories.map(encodeURIComponent).join(",");
          queryString += `&categories=${categoriesString}`; 
        }

        // Append sortByPrice is available
        if(sortByPrice){
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`; 
        }

        return {
          url:queryString,
          method:"GET", 
        }
      }
    }),
    getPublishedCourse: builder.query({
      query: () => ({
        url: "/published-courses",
        method: "GET",
      }),
    }),
    GetCreatorCourse: builder.query({
      query: () => ({ url: "", method: "GET" }),
      providesTags: ["Refetch_Creator_Course"],
    }),

    EditCourse: builder.mutation({
      query: ({ courseId, formData }) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
    }),

    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId }) => ({
        url: `/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    getCourseLecture: builder.query({
      query: ( courseId ) => ({
        url: `/${courseId}/lecture`,
        method: "GET",
      }),
    }),
      editLecture: builder.mutation({
        query: ({
          lectureTitle,
          videoInfo,
          isPreviewFree,
          courseId,
          lectureId,
        }) => ({
          url: `/${courseId}/lecture/${lectureId}`,
          method: "POST",
          body: { lectureTitle, videoInfo, isPreviewFree },
        }),
     
  }),
  removeLecture: builder.mutation({
    query: (lectureId) => ({
      url: `/lecture/${lectureId}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Refetch_Lecture"],
  }),
  getLectureById: builder.query({
    query: (lectureId) => ({
      url: `/lecture/${lectureId}`,
      method: "GET",
    }),
  }),
  //query is true or false type
  publishCourse: builder.mutation({
    query: ({ courseId, query }) => ({
      url: `/${courseId}?publish=${query}`,
      method: "PATCH",
    }),
  }),
})
})

// Corrected export statement
export const {
  useCreateCourseMutation,
  useGetCreatorCourseQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useCreateLectureMutation, useGetCourseLectureQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  useGetLectureByIdQuery,
  usePublishCourseMutation,useGetPublishedCourseQuery,
  useGetSearchCourseQuery
} = courseApi;
