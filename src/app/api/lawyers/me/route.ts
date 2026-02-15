import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { LawyerModel } from "@/models/Lawyer";
import { UserModel } from "@/models/User";
import { verifyAuth, unauthorizedResponse } from "@/lib/apiAuth";

export async function GET(request: Request) {
  const authUser = await verifyAuth(request);
  if (!authUser) {
    return unauthorizedResponse();
  }
  const userId = authUser.id;
  await connectToDatabase();

  const lawyer = await LawyerModel.findOne({ userId }).lean();
  if (!lawyer) return NextResponse.json({ message: "Lawyer profile not found" }, { status: 404 });

  const userProfile = await UserModel.findById(userId, "name email city").lean();

  return NextResponse.json({ lawyer, user: userProfile });
}

export async function PUT(request: Request) {
  const user = await verifyAuth(request);
  if (!user) {
    return unauthorizedResponse();
  }
  const userId = user.id;
  await connectToDatabase();

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Invalid body" }, { status: 400 });

  // whitelist allowed fields
  const allowed: any = {};
  if (body.specialization !== undefined) allowed.specialization = body.specialization;
  if (body.category !== undefined) allowed.category = body.category;
  if (body.experience !== undefined) allowed.experience = body.experience;
  if (body.price !== undefined) allowed.price = body.price;
  if (body.languages !== undefined) {
    allowed.languages = Array.isArray(body.languages) ? body.languages : String(body.languages).split(",").map((s: string) => s.trim()).filter(Boolean);
  }
  if (body.availability !== undefined) {
    allowed.availability = {
      dates: Array.isArray(body.availability.dates) ? body.availability.dates : [],
      slots: Array.isArray(body.availability.slots) ? body.availability.slots : [],
    };
  }
  if (body.city !== undefined) allowed.city = body.city;

  const updated = await LawyerModel.findOneAndUpdate({ userId }, { $set: allowed }, { new: true }).lean();
  if (!updated) return NextResponse.json({ message: "Lawyer profile not found" }, { status: 404 });

  return NextResponse.json({ lawyer: updated });
}