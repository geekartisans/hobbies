import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/Modal";

const hobbySchema = z.object({
  userId: z.number().int().positive("Please select a user"),
  hobbies: z.string().min(1, "Hobby is required").max(255),
});

type HobbyFormData = z.infer<typeof hobbySchema>;

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface AddHobbiesProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HobbyFormData) => void;
  users: User[];
}

export const AddHobbiesModal = ({
  isOpen,
  onClose,
  onSubmit,
  users,
}: AddHobbiesProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<HobbyFormData>({
    resolver: zodResolver(hobbySchema),
  });

  const handleFormSubmit = async (data: HobbyFormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add User Hobby">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="userId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            User <span className="text-red-500">*</span>
          </label>
          <select
            {...register("userId", { valueAsNumber: true })}
            id="userId"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            defaultValue=""
          >
            <option value="" disabled>
              Select a user
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
          {errors.userId && (
            <p className="mt-1 text-sm text-red-600">{errors.userId.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="hobbies"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Hobby <span className="text-red-500">*</span>
          </label>
          <input
            {...register("hobbies")}
            type="text"
            id="hobbies"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., Reading, Swimming, Photography"
          />
          {errors.hobbies && (
            <p className="mt-1 text-sm text-red-600">
              {errors.hobbies.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Hobby"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
