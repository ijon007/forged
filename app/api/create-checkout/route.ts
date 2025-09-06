import { type NextRequest, NextResponse } from "next/server";
import { getCourseCheckoutUrl } from "@/actions/course-db-actions";

export async function POST(request: NextRequest) {
  try {
    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Get checkout URL for the course
    const result = await getCourseCheckoutUrl(courseId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      checkoutUrl: result.checkoutUrl,
    });
  } catch (error) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
