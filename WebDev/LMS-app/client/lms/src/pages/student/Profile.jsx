import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";

const Profile = () => {
  // State for name change and profile photo
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Fetch user data
  const { data, isLoading,refetch } = useLoadUserQuery();
  const [updateUser, { data: updateUserData, isLoading: updateUserIsLoading, error, isSuccess, isError }] =
    useUpdateUserMutation();

  // Handle profile photo change
  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  // Handle user update
  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);

    try {
      const response = await updateUser(formData).unwrap(); // Handle response
      toast.success(response.message || "Profile updated successfully");
    } catch (err) {
      toast.error(err.data?.message || "Failed to update profile");
    }
  };

  // Update name when user data is available
  useEffect(() => {
    if (data?.user) {
      setName(data.user.name);
    }
  }, [data]);

  // Show success/error messages
  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(updateUserData?.message || "Profile updated successfully");
    }
    if (isError) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  }, [isSuccess, isError, updateUserData, error]);

  if (isLoading) return <h1>Profile Loading...</h1>;
  if (!data?.user) return <h1>User data not available</h1>;

  const user = data&&data.user;

  return (
    <div className="max-w-4xl mx-auto px-4 my-24">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center gap-3 rounded-full overflow-hidden">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4 rounded-full overflow-hidden">
            <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">{user.name}</span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">{user.email}</span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">{user.role?.toUpperCase()}</span>
            </h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="mt-2">
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Name</Label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Profile Photo</Label>
                    <Input onChange={onChangeHandler} type="file" accept="image/*" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button disabled={updateUserIsLoading} onClick={updateUserHandler}>
                    {updateUserIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div>
        <h1 className="font-medium text-lg">Courses you're enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user?.enrolledCourses?.length > 0 ? (
            user.enrolledCourses.map((course, index) => <Course course={course} key={course._id || index} />)
          ) : (
            <h1>You haven't enrolled yet</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
