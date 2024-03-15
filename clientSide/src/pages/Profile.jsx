import {useSelector,useDispatch} from "react-redux"

import { useEffect, useRef, useState } from "react"
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from "firebase/storage"
import { app } from "../firebase";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, updateUserFailure,updateUserStart, updateUserSuccess } from "../../redux/slices/userSlice";
export default function Profile() {
  const fileRef=useRef(null)
  const {currentUser,loading,error}=useSelector((state) =>state.user)
  const [file,setFile]=useState(undefined)
  const [filePerc,setFilePerc]=useState(0);
  const [fileUploadError,setFileUploadError]=useState(false);
  const [formData,setFormData]=useState({})
  const dispatch=useDispatch();
  useEffect(()=>{
    if(file){
      handelFileUpload(file);
    }
  },[file]);
  useEffect(() => {
    console.log('Current User:', currentUser);
}, [currentUser]);

  const handelFileUpload = (file)=> {
      const storage =getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef=ref(storage,fileName);
      const uploadTask=uploadBytesResumable(storageRef,file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePerc(Math.round(progress));
        },
        () => {
          setFileUploadError(true);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setFormData((prevData) => ({ ...prevData, avatar: downloadURL }));
          } catch (error) {
            console.error('Error getting download URL:', error);
          }
        }
      );
    };
    
    const handleChange =(e)=>{
      setFormData({...formData,[e.target.id]:e.target.value})
    }
    console.log(formData)

  const handleSubmit =async(e)=>{
    e.preventDefault();
    
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/users/update/${currentUser._id}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      });
      const data=res.json();
      if(data.success===false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data))
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  };
  
  

  const handleDeleteUser =async ()=>{
      try {
        dispatch(deleteUserStart());
        const res= await fetch(`/api/users/delete/${currentUser?._id}`,{
          method:"DELETE",
        });
        const data=await res.json();
        if(data.success===false){
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
  }
  
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={e=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
        <img onClick={()=>fileRef.current.click()} src={formData?.avatar || currentUser.avatar} alt="profile" className="rounded-full h-24 
          w-24 object-cover cursor-pointer self-center mt-2"/>
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error image upload</span> )
            :
            filePerc > 0 && filePerc <100 ? (
            <span className="text-slate-700">
              {`Uploading image ${filePerc}%`}
            </span> )
            :
            filePerc === 100 && !fileUploadError?(
            <span className="text-green-700">Image successfully uploaded</span>
            )
            :
            ""
          }
        </p>
        <input type="text" defaultValue={currentUser.username} onChange={handleChange} placeholder="username" id="username" className="border p-3 rounded-lg"/>
        <input type="email" defaultValue={currentUser.email} onChange={handleChange} placeholder="email" id="email" className="border p-3 rounded-lg"/>
        <input type="password"  placeholder="password" onChange={handleChange} id="password" className="border p-3 rounded-lg"/>
        <button className="bg-slate-700 text-white rounded-lg 
          p-3 uppercase hover:opacity-95">{loading ? "Loading...":"update"}</button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
    </div>
  )
}
