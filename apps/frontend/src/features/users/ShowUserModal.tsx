import { Modal } from "@/components/Modal";
import { HiUser, HiLocationMarker, HiPhone, HiSparkles } from "react-icons/hi";
import type { User } from "./api";
import type { FC } from "react";

interface ShowUserProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const ShowUserModal: FC<ShowUserProps> = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details">
      <div className="space-y-6">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
            <HiUser className="h-4 w-4 text-gray-500" />
            Personal Information
          </h4>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs font-medium text-gray-500">First Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.firstName}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Last Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.lastName}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
            <HiLocationMarker className="h-4 w-4 text-gray-500" />
            Contact Information
          </h4>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user.address || "N/A"}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <HiPhone className="h-4 w-4 text-gray-500" />
              <div className="flex-1">
                <dt className="text-xs font-medium text-gray-500">
                  Phone Number
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.phoneNumber || "N/A"}
                </dd>
              </div>
            </div>
          </dl>
        </div>
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
            <HiSparkles className="h-4 w-4 text-gray-500" />
            Hobbies ({user.hobbies?.length || 0})
          </h4>
          {user.hobbies && user.hobbies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.hobbies.map((hobby) => (
                <span
                  key={hobby.id}
                  className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                >
                  {hobby.hobbies}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hobbies added yet</p>
          )}
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
