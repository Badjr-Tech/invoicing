"use client";

import { logout } from "@/app/login/actions";

/**
 * `onDark` is for the sidebar, which sits on deep sage. The default styling
 * assumes a light surface and would be nearly invisible there.
 */
export default function LogoutButton({ onDark = false }: { onDark?: boolean }) {
  return (
    <form action={logout}>
      <button
        type="submit"
        className={`rounded-control bg-transparent px-3 py-1.5 text-xs font-semibold transition ${
          onDark
            ? "text-sage-200 hover:bg-sage-700 hover:text-white"
            : "text-clay-600 hover:bg-clay-100 hover:text-clay-800"
        }`}
      >
        Log out
      </button>
    </form>
  );
}
