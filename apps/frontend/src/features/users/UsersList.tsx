import { useState } from "react";
import { HiPlus, HiTrash, HiEye } from "react-icons/hi";
import { AddUserModal } from "./AddUserModal";
import { AddHobbiesModal } from "./AddHobbiesModal";
import { ShowUserModal } from "./ShowUserModal";
import { getUsers, postUsers, deleteUsers, postHobbies } from "./api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ConfirmModal } from "@/components/ConfirmModal";
import type { User, Hobbies } from "./api";

export const UsersList = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddHobbiesOpen, setIsAddHobbiesOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: ["users"], queryFn: getUsers });

  const addUserMutation = useMutation({
    mutationFn: postUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const delUserMutation = useMutation({
    mutationFn: deleteUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const addHobbiesMutation = useMutation({
    mutationFn: postHobbies,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

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

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700"
                >
                  Last Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700"
                >
                  Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700"
                >
                  Phone Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700"
                >
                  Hobbies
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {!query?.data?.length && (
                <tr>
                  <td
                    colSpan={6}
                    className="whitespace-nowrap py-4 text-center text-sm text-gray-500"
                  >
                    No users yet. Add your first user to get started.
                  </td>
                </tr>
              )}

              {query.data?.map((user) => {
                return (
                  <tr
                    key={`${user.id}`}
                    className="transition-colors hover:bg-gray-50 text-gray-900"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      {user.firstName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.lastName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.address ?? "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.phoneNumber ?? "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1.5">
                        {user?.hobbies?.length ? (
                          <>
                            {user.hobbies.slice(0, 3).map((hobby, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                              >
                                {hobby.hobbies}
                              </span>
                            ))}
                            {user.hobbies.length > 3 && (
                              <span
                                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 cursor-help"
                                title={user.hobbies
                                  .slice(3)
                                  .map((h) => h.hobbies)
                                  .join(", ")}
                              >
                                +{user.hobbies.length - 3} more
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="rounded border border-blue-300 bg-white p-1.5 text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          title="View Details"
                        >
                          <HiEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setUserToDelete(user.id)}
                          className="rounded border border-red-300 bg-white p-1.5 text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          title="Delete"
                        >
                          <HiTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSubmit={(data) => {
          addUserMutation.mutate(data as User);

          setIsAddUserOpen(false);
        }}
      />

      <AddHobbiesModal
        users={query.data ?? []}
        isOpen={isAddHobbiesOpen}
        onClose={() => setIsAddHobbiesOpen(false)}
        onSubmit={(data) => {
          addHobbiesMutation.mutate(data as Hobbies);

          setIsAddUserOpen(false);
        }}
      />

      <ShowUserModal
        isOpen={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
      />

      <ConfirmModal
        isOpen={userToDelete !== null}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => {
          if (userToDelete) {
            delUserMutation.mutate(userToDelete);
          }
        }}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone and will delete all associated hobbies."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};
