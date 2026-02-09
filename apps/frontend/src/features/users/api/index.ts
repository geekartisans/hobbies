export interface User {
  id: number;
  firstName: string;
  lastName: string;
  address?: string;
  phoneNumber?: string;
  hobbies?: Hobbies[];
  createdAt: string;
  updatedAt: string;
}

export interface Hobbies {
  id: number;
  userId: number;
  hobbies: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD && typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000");
const USERS_ENDPOINT = `${API_BASE_URL}/api/users`;
const HOBBIES_ENDPOINT = `${API_BASE_URL}/api/hobbies`;

export const getUsers = async () => {
  const response = await fetch(USERS_ENDPOINT);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json() as Promise<User[]>;
};

export const postUsers = async (user: Partial<User>) => {
  const response = await fetch(USERS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json() as Promise<User>;
};

export const deleteUsers = async (id: number) => {
  const response = await fetch(`${USERS_ENDPOINT}/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return response.json() as Promise<User>;
};

export const postHobbies = async (hobbies: Partial<Hobbies>) => {
  const response = await fetch(HOBBIES_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hobbies),
  });

  if (!response.ok) {
    throw new Error("Failed to create hobbies");
  }

  return response.json() as Promise<Hobbies>;
};
