import { Button, Input } from "@/components/ui";

const Login = () => {
  return (
    <form className="flex flex-col gap-4">
      <Input
        id="login-email-input"
        type="email"
        name="email"
        label="Email"
        placeholder="Type your Email..."
      />
      <Input
        id="login-password-input"
        type="password"
        name="password"
        label="Password"
        placeholder="Type your password..."
      />
      <Button className="mt-6">Log in</Button>
    </form>
  );
};

export default Login;
