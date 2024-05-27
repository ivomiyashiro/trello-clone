import { ArrowRight } from "lucide-react";
import useOnBoarding from "./OnBoarding.hook";
import { Button, Input, Loader } from "@/components/ui";

const OnBoarding = () => {
  const { isLoading, handleSubmit, setWorkspaceName } = useOnBoarding();

  return (
    <div className="mx-auto my-40 max-w-[500px]">
      <h2 className="mb-12 text-center text-3xl font-bold">New Workspace</h2>
      <form className="flex w-full items-end gap-2" onSubmit={handleSubmit}>
        <div className="w-full">
          <Input
            name="workspace-name"
            type="text"
            label="Workspace name"
            placeholder="Enter your workspace name..."
            className="w-full"
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
        </div>
        <Button className="px-3" disabled={isLoading}>
          {isLoading ? (
            <Loader />
          ) : (
            <ArrowRight aria-label="Submit" className="size-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default OnBoarding;
