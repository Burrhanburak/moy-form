import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: packageId } = await params;

    console.log(
      `🗑️ Deleting package: ${packageId} by user: ${session.user.id}`
    );

    // Get package to verify ownership and status
    const pkg = await prisma.packages.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Only allow deleting own packages
    if (pkg.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this package" },
        { status: 403 }
      );
    }

    // Only allow deleting PENDING packages (not paid ones)
    if (pkg.status !== "PENDING") {
      return NextResponse.json(
        {
          error: `Cannot delete ${pkg.status} package. Only PENDING packages can be deleted.`,
        },
        { status: 400 }
      );
    }

    // Delete the package
    await prisma.packages.delete({
      where: { id: packageId },
    });

    console.log(`✅ Package deleted: ${packageId}`);

    return NextResponse.json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting package:", error);
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    );
  }
}
