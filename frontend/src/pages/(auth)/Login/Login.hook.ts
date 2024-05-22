import { useState } from "react";

import { useAuth } from "@/hooks";

import { loginScheme } from "@/lib/schemes";
import { handleError } from "@/helpers/handleError";

const useLogin = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      loginScheme.parse(formData);
      await login(formData);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    handleInputChange,
    handleSubmit,
  };
};

export default useLogin;
