import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/db";
import { LawyerModel } from "@/models/Lawyer";
import { UserModel } from "@/models/User";
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from "@/lib/apiAuth";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Lawyer ID" }, { status: 400 });
    }

    // Find lawyer
    const lawyer = await LawyerModel.findById(id).lean() as any;

    if (!lawyer) {
      return NextResponse.json({ error: "Lawyer not found" }, { status: 404 });
    }

    // Fetch user details using lawyer.userId
    const user = await UserModel.findById(lawyer.userId)
      .select("name email")
      .lean();

    // Merge lawyer + user
    const finalData = {
      ...lawyer,
      user: user ? { name: user.name, email: user.email } : null,
    };

    return NextResponse.json(
      {
        success: true,
        data: finalData
      },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: "Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await verifyAuth(req);
    if (!authUser) {
      return unauthorizedResponse();
    }

    await connectToDatabase();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Lawyer ID" }, { status: 400 });
    }

    const lawyer = await LawyerModel.findById(id);
    if (!lawyer) {
      return NextResponse.json({ error: "Lawyer not found" }, { status: 404 });
    }

    const body = await req.json();
    
    // Check if user is the lawyer owner or admin
    const isOwner = lawyer.userId?.toString() === authUser.id;
    const isAdmin = authUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      return forbiddenResponse("You don't have permission to update this lawyer profile");
    }

    // Whitelist allowed fields
    const allowed: any = {};
    if (body.specialization !== undefined) allowed.specialization = body.specialization;
    if (body.category !== undefined) allowed.category = body.category;
    if (body.experience !== undefined) allowed.experience = body.experience;
    if (body.price !== undefined) allowed.price = body.price;
    if (body.city !== undefined) allowed.city = body.city;
    if (body.languages !== undefined) allowed.languages = body.languages;
    if (body.availability !== undefined) allowed.availability = body.availability;

    // Only admin can change profileStatus
    if (body.profileStatus !== undefined && isAdmin) {
      allowed.profileStatus = body.profileStatus;
    }

    const updated = await LawyerModel.findByIdAndUpdate(id, { $set: allowed }, { new: true }).lean();

    return NextResponse.json(
      {
        success: true,
        data: updated
      },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: "Server Error", details: error.message },
      { status: 500 }
    );
  }
}
