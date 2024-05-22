import { Button, Input } from "@/components/ui";
import useLogin from "./Login.hook";

const Login = () => {
  const { isLoading, handleInputChange, handleSubmit } = useLogin();

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        id="login-email-input"
        type="email"
        name="email"
        label="Email"
        placeholder="Type your Email..."
        onChange={handleInputChange}
      />
      <Input
        id="login-password-input"
        type="password"
        name="password"
        label="Password"
        placeholder="Type your password..."
        onChange={handleInputChange}
      />
      <Button className="mt-6" disabled={isLoading}>
        {isLoading ? "Loading..." : "Log in"}
      </Button>
    </form>
  );
};

export default Login;
