"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {  Edit, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type React from "react" // Added import for React
import { useRouter } from "next/navigation";
import BackArrow from "@/public/back-arrow.svg";
import UserIcon from "@/public/user.svg"
import axios from "axios"
import { BASE_URL } from "@/lib/config"
import LoadingScreen from "@/components/loading-screen"

interface User {
  name: string;
  imageUrl: string;
  username: string;
  password: string;
}

export default function ProfilePage() {
  const [user,setUser] = useState<User>();
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const usernameInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [username, setUsername] = useState((user && user.username) || "")
  const [password, setPassword] = useState((user && user.password ) || "")

  // This would typically come from your authentication system
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/me`,{
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setUser(res.data.user);
      }
      catch(error){
        console.log(error);
      }
    }
    fetchData();
  },[]);

  useEffect(() => {
    if(user) {
      setUsername(user.username);
      setPassword(user.password);
    }
  },[user]);

  useEffect(() => {
    if (isEditingUsername && usernameInputRef.current) {
      usernameInputRef.current.focus()
    }
  }, [isEditingUsername])

  useEffect(() => {
    if (isEditingPassword && passwordInputRef.current) {
      passwordInputRef.current.focus()
    }
  }, [isEditingPassword])

  if(!user) {
    return <LoadingScreen/>;
  }

  const handleEditPictureClick = () => {
    // Implement picture edit functionality here
    console.log("Edit picture clicked")
  }

  const handleUsernameClick = () => {
    setIsEditingUsername(true)
  }

  const handlePasswordClick = () => {
    setIsEditingPassword(true)
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleUpdateUsername = async () => {
    // Here you would typically update the username in your backend
    try {
      await axios.put(`${BASE_URL}/api/v1/me`,{
        username: username
      },{
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setIsEditingUsername(false)
    }
    catch(error){
      console.log(error);
    }
  }

  const handleUpdatePassword = async() => {
    // Here you would typically update the password in your backend
    try {
      await axios.put(`${BASE_URL}/api/v1/me`,{
        password: password
      },{
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setIsEditingPassword(false)
      setShowPassword(false)
    }
    catch(error){
      console.log(error);
    }
  }

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement) {
      if (!e.target.closest("#username-field") && !e.target.closest("#password-field")) {
        setUsername(user.username);
        setPassword(user.password);
        setIsEditingUsername(false)
        setIsEditingPassword(false)
        setShowPassword(false)
      }
    }
  }



  return (
    <div className="min-h-screen bg-white dark:bg-background " onClick={handleClickOutside}>
      {/* Blue section covering ~30% of the page */}
      <div className="sm:h-[30vh] h-[20vh] bg-muted dark:bg-black border-b-[1px] dark:border-muted text-muted-foreground relative">
        {/* Circle for user image or icon */}
    
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-transparent shadow-lg">
            { user.imageUrl  ? (
              <Image src={user.imageUrl || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
            ) : (
              <UserIcon className="w-28 h-28 stroke-[12px] stroke-blue-600 fill-blue-600" />
            )}
          </div>
        </div>
      </div>

      

      {/* Content area */}
      <div className="max-w-3xl mx-auto">      
          <Button 
            onClick={() => router.push('/profile')}
            className=" mt-2 flex ml-4 bg-transparent w-fit rounded-md cursor-pointer shadow-none justify-start text-black border dark:border-card border-gray-200 hover:bg-gray-200 dark:hover:bg-card ">
                <BackArrow className="h-6 w-6 stroke-0 fill-gray-800 dark:fill-blue-300" />
          </Button>
      <div className="max-w-3xl mx-auto pt-12 px-4 sm:px-6 lg:px-8 pb-12  ">
        {user.name &&
          <h1 className="text-3xl font-bold text-center text-gray-900 sm:text-4xl mb-8 dark:text-white">{user.name}</h1>
        }
        {/* Edit picture button */}
        <div className="flex justify-center mb-8">
          <Button
            variant="secondary"
            className="bg-blue-600 dark:text-black text-white hover:bg-gray-800"
            onClick={handleEditPictureClick}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Picture
          </Button>
        </div>

        {/* Username section */}
        <div className="space-y-2 mb-6" id="username-field">
          <label
            htmlFor="username"
            className={`block text-sm font-medium ${isEditingUsername ? "text-blue-500" : "text-gray-500"}`}
          >
            USERNAME
          </label>
          <div className="flex items-center cursor-text space-x-4" onClick={handleUsernameClick}>
            {isEditingUsername ? (
              <input
                ref={usernameInputRef}
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                className="block w-full dark:bg-black dark:bg-opacity-0 dark:text-blue-200 border-none p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
              />
            ) : (
              <span className="text-gray-900 cursor-pen dark:text-blue-200" >
                {username}
              </span>
            )}
            {isEditingUsername && (
              <button onClick={handleUpdateUsername} className="text-blue-500 text-sm font-medium">
                Update
              </button>
            )}
          </div>
          <div className={`h-px ${isEditingUsername ? "bg-blue-500" : "bg-gray-200"}`} />
        </div>

        {/* Password section */}
        <div className="space-y-2" id="password-field">
          <label
            htmlFor="password"
            className={`block text-sm font-medium ${isEditingPassword ? "text-blue-500" : "text-gray-500"}`}
          >
            PASSWORD
          </label>
          <div className="flex items-center cursor-text space-x-4" onClick={handlePasswordClick}>
            {isEditingPassword ? (
              <div className="relative w-full">
                <input
                  ref={passwordInputRef}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="block w-full border-none p-0 dark:bg-black dark:bg-opacity-0 dark:text-blue-200 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none pr-10 "
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            ) : (
              <span className="text-gray-900 cursor-pen dark:text-blue-200" >
                {password ? "•".repeat(password.length) : ""}
              </span>
            )}
            {isEditingPassword && (
              <button onClick={handleUpdatePassword} className="text-blue-500 text-sm font-medium">
                Update
              </button>
            )}
          </div>
          <div className={`h-px ${isEditingPassword ? "bg-blue-500" : "bg-gray-200"}`} />
        </div>
      </div>
      </div>
    </div>
  )
}

