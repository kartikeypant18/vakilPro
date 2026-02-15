import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { LawyerModel } from '@/models/Lawyer';
import { UserModel } from '@/models/User';

export async function GET() {
  try {
      await connectToDatabase();
      // Find all lawyers with profileStatus 'verified' and populate user info
      const lawyers = await LawyerModel.find({ profileStatus: 'verified' })
        .populate({
          path: 'userId',
          model: UserModel,
          select: 'name email city',
        })
        .lean();

      // Merge user info into lawyer object for frontend
      const result = lawyers.map(lawyer => {
        const user = lawyer.userId || {};
        return {
          id: String(lawyer._id),
          name: user.name,
          email: user.email,
          city: user.city,
          specialization: lawyer.specialization,
          category: lawyer.category,
          experience: lawyer.experience,
          languages: lawyer.languages,
          price: lawyer.price,
          availability: lawyer.availability,
          rating: lawyer.rating,
          profileStatus: lawyer.profileStatus,
          createdAt: lawyer.createdAt,
          updatedAt: lawyer.updatedAt,
        };
      });
      return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to fetch lawyers', details: message }, { status: 500 });
  }
}
