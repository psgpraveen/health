"use client";
export default function UserProfile({ user }) {
  return (
    <div className="border p-4 rounded">
      <h2 className="text-xl mb-2">Profile</h2>
      <div><b>Name:</b> {user.name}</div>
      <div><b>Email:</b> {user.email}</div>
      <div><b>Role:</b> {user.role}</div>
    </div>
  );
}
