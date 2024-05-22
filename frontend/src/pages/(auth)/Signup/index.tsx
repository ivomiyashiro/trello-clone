import useSignup from "./Signup.hook";
import { Button, Input } from "@/components/ui";

const Signup = () => {
  const { isLoading, handleInputChange, handleSubmit } = useSignup();

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        id="signup-name-input"
        name="name"
        type="text"
        label="Full name"
        placeholder="Type your name..."
        onChange={handleInputChange}
      />
      <Input
        id="signup-email-input"
        name="email"
        type="email"
        label="Email"
        placeholder="Type your email..."
        onChange={handleInputChange}
      />
      <Input
        id="signup-password-input"
        name="password"
        type="password"
        label="Password"
        placeholder="Type your password..."
        onChange={handleInputChange}
      />
      <Button className="mt-6" disabled={isLoading}>
        {isLoading ? "Cargando..." : "Sign up"}
      </Button>
    </form>
  );
};

export default Signup;
