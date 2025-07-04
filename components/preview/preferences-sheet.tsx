import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Preferences from "./preferences"
import { Settings2 } from "lucide-react"
import Socials from "./socials"
import { Course } from "@/db/schemas/course-schema"
import { Button } from "@/components/ui/button"

const PreferencesSheet = ({ basePreviewData, dbCourse }: { basePreviewData: any, dbCourse: Course }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="hover:bg-muted py-2 rounded-xl" size="lg">
                    <Settings2 className="w-4 h-4" />
                    Preferences
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-scroll scrollbar-hide w-[600px] sm:max-w-[600px]">
                <SheetHeader className="sr-only">
                    <SheetTitle>Preferences</SheetTitle>
                    <SheetDescription>
                        Set your preferences
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-6 mx-2">
                    <Preferences previewData={basePreviewData} />
                    <Socials courseId={dbCourse.id} initialLinks={dbCourse.links || []} />
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default PreferencesSheet