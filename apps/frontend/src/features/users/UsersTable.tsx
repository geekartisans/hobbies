import { HiTrash, HiEye } from "react-icons/hi";
import type { User } from "./api";
import type { FC } from "react";

interface UsersTableProps {
  users: User[];
  onView: (user: User) => void;
  onDelete: (userId: string) => void;
}

export const UsersTable: FC<UsersTableProps> = ({
  users,
  onView,
  onDelete,
}) => {
  return (
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
            {!users.length && (
              <tr>
                <td
                  colSpan={6}
                  className="whitespace-nowrap py-4 text-center text-sm text-gray-500"
                >
                  No users yet. Add your first user to get started.
                </td>
              </tr>
            )}

            {users.map((user) => (
              <tr
                key={user.id}
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
                    {user.hobbies?.length ? (
                      <>
                        {user.hobbies.slice(0, 3).map((hobby) => (
                          <span
                            key={hobby.id}
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
                      onClick={() => onView(user)}
                      className="rounded border border-blue-300 bg-white p-1.5 text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      title="View Details"
                    >
                      <HiEye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="rounded border border-red-300 bg-white p-1.5 text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      title="Delete"
                    >
                      <HiTrash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
