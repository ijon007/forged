import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Course } from "@/db/schemas/course-schema";
import Preferences from "./preferences";
import Socials from "./socials";

const PreferencesSheet = ({
  basePreviewData,
  dbCourse,
}: {
  basePreviewData: any;
  dbCourse: Course;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="rounded-xl py-2 hover:bg-muted"
          size="lg"
          variant="outline"
        >
          <Settings2 className="h-4 w-4" />
          <span className="hidden md:inline">Preferences</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="scrollbar-hide w-10/12 overflow-scroll sm:max-w-[600px]">
        <SheetHeader className="sr-only">
          <SheetTitle>Preferences</SheetTitle>
          <SheetDescription>Set your preferences</SheetDescription>
        </SheetHeader>
        <div className="mx-2 flex flex-col gap-6">
          <Preferences previewData={basePreviewData} />
          <Socials courseId={dbCourse.id} initialLinks={dbCourse.links || []} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PreferencesSheet;
