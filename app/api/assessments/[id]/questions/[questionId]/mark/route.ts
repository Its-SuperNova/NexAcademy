import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateAssessmentTotalMarks } from "@/lib/utils/assessment-marks";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; questionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sectionId, mark } = await request.json();
    const { questionId } = await params;
    
    if (!sectionId || !questionId || mark === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Await params before using
    // Already destructured from params above

    
    // First, check if the record exists
    const existingRecords = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT * FROM "SectionQuestion"
      WHERE "sectionId" = ${sectionId}
      AND "questionId" = ${questionId}
      LIMIT 1
    `;

    if (!existingRecords || existingRecords.length === 0) {
      return NextResponse.json(
        { error: "Question not found in section" },
        { status: 404 }
      );
    }

    // Update the mark
    await prisma.$queryRaw`
      UPDATE "SectionQuestion"
      SET "sectionMark" = ${mark}
      WHERE "sectionId" = ${sectionId}
      AND "questionId" = ${questionId}
    `;

    await updateAssessmentTotalMarks(params.id);

    return NextResponse.json({ 
      message: "Mark updated successfully",
      sectionId,
      questionId,
      mark 
    });
  } catch (error) {
    console.error("Error updating section mark:", error);
    return NextResponse.json(
      { error: "Failed to update section mark" },
      { status: 500 }
    );
  }
}