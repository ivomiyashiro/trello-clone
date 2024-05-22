import { useState } from "react";

import { useAuth } from "@/hooks";
import { singupScheme } from "@/lib/schemes";

import { handleError } from "@/helpers/handleError";

const useSignup = () => {
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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
      singupScheme.parse(formData);
      await signup(formData);
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

export default useSignup;
