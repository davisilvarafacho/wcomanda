import { auth } from "services/auth";

export function useAuth() {
  async function login(email, password) {
    const response = await auth.post("login/", {
      system: import.meta.env.VITE_APPLICATION_UUID,
      username: email,
      password,
    });
    response.data["$status"] = response.status;
    return response.data;
  }

  return {
    login,
  };
}
