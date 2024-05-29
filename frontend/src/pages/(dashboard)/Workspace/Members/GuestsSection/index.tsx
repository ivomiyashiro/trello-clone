import { Loader } from "@/components/ui";

const GuestsSection = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className="w-full">
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold">Guests</h2>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Guests can only view and edit the boards to which they've been added.
        </p>
      </div>
      <div className="border-b py-3">
        {isLoading ? (
          <Loader />
        ) : (
          <p className="text-center text-sm text-gray-400">
            There are no guests in this Workspace.
          </p>
        )}
      </div>
    </div>
  );
};

export default GuestsSection;
