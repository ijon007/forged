import { ArrowRight } from "lucide-react";
import { CreateCourseDialog } from "@/components/dashboard/create-course-dialog";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "../ui/sidebar";

export function DashboardHeader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-row items-center justify-between gap-2">
          <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text font-bold text-2xl text-transparent tracking-tight sm:text-3xl lg:text-4xl dark:from-gray-100 dark:to-gray-300">
            Dashboard
          </h1>
          <SidebarTrigger className="block md:hidden" />
        </div>
        <CreateCourseDialog>
          <Button
            className="group relative w-full overflow-hidden rounded-xl bg-black text-white transition-all hover:scale-105 hover:bg-gray-800 hover:shadow-2xl sm:w-auto"
            size="lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="relative">Create Page</span>
            <ArrowRight className="relative ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CreateCourseDialog>
      </div>
    </div>
  );
}
