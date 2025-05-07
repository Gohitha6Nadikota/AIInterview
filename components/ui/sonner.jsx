"use client";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "bg-white text-black border shadow-md",
          description: "text-black",
          actionButton: "bg-gray-100 text-black",
          cancelButton: "bg-gray-200 text-black",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
