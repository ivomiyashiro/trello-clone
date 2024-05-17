import { Button, Input } from "@/components/ui";

const Signup = () => {
  return (
    <form className="flex flex-col gap-4">
      <Input
        id="signup-name-input"
        name="name"
        type="text"
        label="Full name"
        placeholder="Type your name..."
      />
      <Input
        id="signup-email-input"
        name="email"
        type="email"
        label="Email"
        placeholder="Type your email..."
      />
      <Input
        id="signup-password-input"
        name="password"
        type="password"
        label="Password"
        placeholder="Type your password..."
      />
      <Button className="mt-6">Sign up</Button>
    </form>
  );
};

export default Signup;
