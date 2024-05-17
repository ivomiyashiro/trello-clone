import { useAuth } from "@/hooks";
import { Button } from "@/components/ui";

const Dashboard = () => {
  const { logout } = useAuth();
  return <Button onClick={logout}>Logout</Button>;
};

export default Dashboard;
