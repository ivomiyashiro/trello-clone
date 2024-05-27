import DashboardSidebar from "./Dashboard/DashboardSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-[85px_1fr] md:grid-cols-[250px_1fr]">
      <div>
        <DashboardSidebar />
      </div>
      <div className="px-6">{children}</div>
    </div>
  );
};

export default DashboardLayout;
