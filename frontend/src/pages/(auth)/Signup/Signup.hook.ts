import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks";
import { signupScheme } from "@/lib/schemes";

import { handleError } from "@/helpers/handleError";

const useSignup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

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
      signupScheme.parse(formData);
      await signup(formData);
      navigate("/auth/login");
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
