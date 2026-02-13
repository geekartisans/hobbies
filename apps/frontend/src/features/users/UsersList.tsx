import { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { AddUserModal } from "./AddUserModal";
import { AddHobbiesModal } from "./AddHobbiesModal";
import { ShowUserModal } from "./ShowUserModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import type { User } from "./api";
import { UsersTable } from "./UsersTable";
import {
  useUsersQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useAddHobbiesMutation,
} from "./hooks/useApi";

export const UsersList = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddHobbiesOpen, setIsAddHobbiesOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { users } = useUsersQuery();
  const addUserMutation = useAddUserMutation();
  const delUserMutation = useDeleteUserMutation();
  const addHobbiesMutation = useAddHobbiesMutation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all users and their hobbies
          </p>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <HiPlus className="h-4 w-4" />
            Add New User
          </button>

          <button
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => setIsAddHobbiesOpen(true)}
          >
            <HiPlus className="h-4 w-4" />
            Add User Hobbies
          </button>
        </div>
      </div>

      <UsersTable
        users={users}
        onView={setSelectedUser}
        onDelete={setUserToDelete}
      />

      {isAddUserOpen && (
        <AddUserModal
          isOpen
          onClose={() => setIsAddUserOpen(false)}
          onSubmit={(data) => {
            addUserMutation.mutate(data);
          }}
        />
      )}

      {isAddHobbiesOpen && (
        <AddHobbiesModal
          users={users}
          isOpen
          onClose={() => setIsAddHobbiesOpen(false)}
          onSubmit={(data) => {
            addHobbiesMutation.mutate(data);
          }}
        />
      )}

      {selectedUser !== null && (
        <ShowUserModal
          isOpen
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
        />
      )}

      {userToDelete !== null && (
        <ConfirmModal
          isOpen
          onClose={() => setUserToDelete(null)}
          onConfirm={() => {
            delUserMutation.mutate(userToDelete);
            setUserToDelete(null);
          }}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone and will delete all associated hobbies."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      )}
    </div>
  );
};
