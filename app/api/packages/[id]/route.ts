import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find package and verify ownership
    const pkg = await prisma.packages.findUnique({
      where: { id },
    });

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    if (pkg.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only allow deletion of PENDING packages
    if (pkg.status !== "PENDING") {
      return NextResponse.json(
        { error: "Only PENDING packages can be deleted" },
        { status: 400 }
      );
    }

    // Delete the package
    await prisma.packages.delete({
      where: { id },
    });

    console.log(`✅ Deleted PENDING package: ${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    );
  }
}
