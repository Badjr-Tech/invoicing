"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { updateProfile } from "./actions";
import { getSession } from "@/app/login/actions";
import Image from "next/image";

// Define a type for the user object in state, matching the updated schema
interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  personalAddress: string | null;
  personalCity: string | null;
  personalState: string | null;
  personalZipCode: string | null;
  profilePhotoUrl: string | null;
}

type FormState = {
  message: string;
  error: string;
} | undefined;

const isPlaceholder = (url: string | null | undefined): boolean => {
  return url?.includes('example.com') ?? false;
};

export default function ProfilePage() {
  const [state, formAction] = useFormState<FormState, FormData>(updateProfile, undefined);
  const [user, setUser] = useState<UserProfile | null>(null); // Use UserProfile type

  useEffect(() => {
    async function fetchAndSetUser() {
      const session = await getSession();
      if (session && session.user) {
        // Cast session.user to UserProfile to match state type
        setUser(session.user as UserProfile);
      }
    }
    fetchAndSetUser();
  }, [state?.message]); // Safely access state.message

  if (!user) {
    return <div className="flex-1 p-6">Loading profile...</div>;
  }

  return (
    <div className="flex-1 p-6">
      {/* Profile Photo Display */}
      <div className="mb-6 flex justify-center">
        {user.profilePhotoUrl && !isPlaceholder(user.profilePhotoUrl) ? (
          <Image src={user.profilePhotoUrl} alt="Profile" width={96} height={96} className="rounded-full object-cover border-2 border-clay-200" />
        ) : (
          <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-clay-500 font-display text-3xl font-semibold border-2 border-clay-200">
            {user.name ? user.name[0].toUpperCase() : '?'}
          </div>
        )}
      </div>

      <h1 className="font-display text-2xl font-semibold text-clay-800">Your Personal Profile</h1> {/* Renamed heading */}
      <p className="mt-4 text-clay-700">Manage your personal information.</p>

      <div className="mt-8 max_w_md">
        <form action={formAction} className="space-y-6">
          {/* Profile Photo */}
          {user.profilePhotoUrl && !isPlaceholder(user.profilePhotoUrl) && (
            <div>
              <label className="block text-sm font-medium text-clay-700">Current Profile Photo</label>
              <Image src={user.profilePhotoUrl} alt="Profile" width={80} height={80} className="mt-1 rounded-full object-cover" />
            </div>
          )}
          <div>
            <label htmlFor="profilePhoto" className="block text-sm font-medium text-clay-700">
              Upload Profile Photo
            </label>
            <input
              id="profilePhoto"
              name="profilePhoto"
              type="file"
              className="mt-1 block w-full text-sm text-clay-800
                file:mr-4 file:py-2 file:px-4
                file:rounded-control file:border-0
                file:text-sm file:font-semibold
                file:bg-[#910000] file:text-white
                hover:file:bg-[#7a0000]"
            />
          </div>

          {/* Email Address (Read-only) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-clay-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={user.email}
              readOnly
              className="mt-1 block w-full rounded-control border-clay-200 shadow-sm bg-clay-100 text-clay-500 cursor-not-allowed"
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-clay-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={user.name}
              required
              className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-sage-400 focus:ring-sage-300 text-clay-800"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-clay-700">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              defaultValue={user.phone}
              required
              className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-sage-400 focus:ring-sage-300 text-clay-800"
            />
          </div>

          {/* Personal Address */}
          <div>
            <label htmlFor="personalAddress" className="block text-sm font-medium text-clay-700">
              Personal Address
            </label>
            <input
              id="personalAddress"
              name="personalAddress"
              type="text"
              defaultValue={user.personalAddress || ''}
              className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-sage-400 focus:ring-sage-300 text-clay-800"
            />
          </div>

          {/* Personal City */}
          <div>
            <label htmlFor="personalCity" className="block text-sm font-medium text-clay-700">
              Personal City
            </label>
            <input
              id="personalCity"
              name="personalCity"
              type="text"
              defaultValue={user.personalCity || ''}
              className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-sage-400 focus:ring-sage-300 text-clay-800"
            />
          </div>

          {/* Personal State */}
          <div>
            <label htmlFor="personalState" className="block text-sm font-medium text-clay-700">
              Personal State
            </label>
            <input
              id="personalState"
              name="personalState"
              type="text"
              maxLength={2}
              defaultValue={user.personalState || ''}
              className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-sage-400 focus:ring-sage-300 text-clay-800"
            />
          </div>

          {/* Personal Zip Code */}
          <div>
            <label htmlFor="personalZipCode" className="block text-sm font-medium text-clay-700">
              Personal Zip Code
            </label>
            <input
              id="personalZipCode"
              name="personalZipCode"
              type="text"
              maxLength={10}
              defaultValue={user.personalZipCode || ''}
              className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-sage-400 focus:ring-sage-300 text-clay-800"
            />
          </div>

          {state?.message && (
            <p className="text-sm text-sage-700">{state.message}</p>
          )}
          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}

          <div>
            <button
              type="submit"
              className="inline-flex justify-center rounded-control border border-transparent bg-[#910000] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#7a0000] focus:outline-none focus:ring-2 focus:ring-sage-300 focus:ring-offset-2"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
