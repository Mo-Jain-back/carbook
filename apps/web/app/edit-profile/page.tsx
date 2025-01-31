"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { User, Edit, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import type React from "react" // Added import for React

export default function ProfilePage() {
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [username, setUsername] = useState("johndoe123")
  const [password, setPassword] = useState("password123")
  const [showPassword, setShowPassword] = useState(false)
  const usernameInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  // This would typically come from your authentication system
  const user = {
    name: "John Doe",
    image: null, // Set to null for this example to show the default icon
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

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleUpdateUsername = () => {
    // Here you would typically update the username in your backend
    setIsEditingUsername(false)
  }

  const handleUpdatePassword = () => {
    // Here you would typically update the password in your backend
    setIsEditingPassword(false)
    setShowPassword(false)
  }

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement) {
      if (!e.target.closest("#username-field") && !e.target.closest("#password-field")) {
        setIsEditingUsername(false)
        setIsEditingPassword(false)
        setShowPassword(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-white" onClick={handleClickOutside}>
      {/* Blue section covering ~30% of the page */}
      <div className="h-[30vh] bg-blue-500 relative">
        {/* Circle for user image or icon */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative w-32 h-32 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
            {user.image ? (
              <Image src={user.image || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
            ) : (
              <User className="w-16 h-16 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-3xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 sm:text-4xl mb-8">{user.name}</h1>

        {/* Edit picture button */}
        <div className="flex justify-center mb-8">
          <Button
            variant="secondary"
            className="bg-black text-white hover:bg-gray-800"
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
          <div className="flex items-center space-x-4">
            {isEditingUsername ? (
              <input
                ref={usernameInputRef}
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                className="block w-full border-none p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
              />
            ) : (
              <span className="text-gray-900 cursor-pen" onClick={handleUsernameClick}>
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
          <div className="flex items-center space-x-4">
            {isEditingPassword ? (
              <div className="relative w-full">
                <input
                  ref={passwordInputRef}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="block w-full border-none p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none pr-10"
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
              <span className="text-gray-900 cursor-pen" onClick={handlePasswordClick}>
                {"•".repeat(password.length)}
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
  )
}

