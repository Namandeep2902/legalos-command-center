import { toast } from "sonner";

export const demo = (title: string, description?: string) => {
  toast(title, description ? { description } : undefined);
};

export const demoOk = (title: string, description?: string) => {
  toast.success(title, description ? { description } : undefined);
};

export const demoWarn = (title: string, description?: string) => {
  toast.warning(title, description ? { description } : undefined);
};
