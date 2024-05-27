import { AxiosError } from "axios";
import { ZodError } from "zod";

import { toast, ToastProps } from "@/components/ui";
import { ToastErrorContent } from "@/components";

export const handleError = (error: unknown) => {
  const toasConfig: ToastProps = {
    variant: "destructive",
    duration: 3000,
  };

  if (error instanceof ZodError) {
    const errorsArray = JSON.parse(error.message);
    const displayErrors = errorsArray.map((error: ZodError) => error.message);

    return toast({
      ...toasConfig,
      title: `${displayErrors.length} Error/s found:`,
      description: <ToastErrorContent errors={displayErrors} />,
    });
  }

  if (error instanceof AxiosError) {
    return toast({
      ...toasConfig,
      title: `Error found:`,
      description: (
        <ToastErrorContent
          errors={[error.response?.data.message || "Internal server error"]}
        />
      ),
    });
  }

  if (error instanceof Error) {
    return toast({
      ...toasConfig,
      title: `Error found:`,
      description: (
        <ToastErrorContent
          errors={[error.message || "Internal server error"]}
        />
      ),
    });
  }
};
