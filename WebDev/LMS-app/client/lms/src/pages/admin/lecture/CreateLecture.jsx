import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

const CreateLecture = () => {

  const [lectureTitle,setLectureTitle]=useState("");
  const params=useParams();
  const courseId=params.courseId;
 
  const navigate=useNavigate();
  const [CreateLecture,{data,isLoading,isSuccess,error}]=useCreateLectureMutation();
  const { data: lectureData, isLoading: lectureLoading, error: lectureError ,refetch}= useGetCourseLectureQuery(courseId);


  const CreateLectureHandler=async ()=>{
    console.log("Sending data:", { lectureTitle, courseId });
    try {
      await CreateLecture({ lectureTitle, courseId });
    } catch (error) {
      console.error("Error creating lecture:", error);
    }
  
  }
  useEffect(()=>{
    if(isSuccess){
      refetch();
      toast.success(data.message);
    }
    if(error){
      toast.error(error.data.message);
    }
  },[isSuccess,error]);
  console.log(lectureData);
  return (
   
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets add lecture, add some basic  details for your new lecture
        </h1>
        {/* <p className="text-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus,
          laborum!
        </p> */}
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Your Course Name"
          />
        </div>
         {/* <Select>
         <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
        
           
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="Next JS">Next JS</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Frontend Development">
                  Frontend Development
                </SelectItem>
                <SelectItem value="Fullstack Development">
                  Fullstack Development
                </SelectItem>
                <SelectItem value="MERN Stack Development">
                  MERN Stack Development
                </SelectItem>
                <SelectItem value="Javascript">Javascript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Docker">Docker</SelectItem>
                <SelectItem value="MongoDB">MongoDB</SelectItem>
                <SelectItem value="HTML">HTML</SelectItem>
              </SelectGroup>
            </SelectContent>
            </Select> */}
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/admin/course/${courseId}`)}>
            Back to course
          </Button>
          <Button disabled={isLoading} onClick={CreateLectureHandler}  >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
        <div className="mt-10">
          {lectureLoading ? (
            <p>Loading lectures...</p>
          ) : lectureError ? (
            <p>Failed to load lectures.</p>
          ) : lectureData.lectures.length === 0 ? (
            <p>No lectures availabe</p>
          ) : (
            lectureData.lectures.map((lecture, index) => (
              <Lecture
                key={lecture._id}
                lecture={lecture}
                courseId={courseId}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  
  )
}

export default CreateLecture
