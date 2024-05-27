import DashboardHeader from "./Dashboard/DashboardHeader";
import DashboardSidebar from "./Dashboard/DashboardSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <DashboardHeader />
      <div className="grid grid-cols-[85px_1fr] md:grid-cols-[250px_1fr]">
        <div>
          <DashboardSidebar />
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
