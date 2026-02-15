import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { LawyerModel } from '@/models/Lawyer';
import { UserModel } from '@/models/User';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/apiAuth';

// GET /api/lawyers/all - Admin endpoint to fetch ALL lawyers (including non-verified)
export async function GET(request: Request) {
  const user = await verifyAuth(request);
  if (!user) {
    return unauthorizedResponse();
  }

  // Only admins can see all lawyers including non-verified
  if (user.role !== 'admin') {
    return forbiddenResponse('Only admins can access this endpoint');
  }

  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const query: any = {};
    if (status) {
      query.profileStatus = status;
    }

    const lawyers = await LawyerModel.find(query)
      .populate({
        path: 'userId',
        model: UserModel,
        select: 'name email city',
      })
      .lean();

    const result = lawyers.map((lawyer: any) => {
      const userInfo = lawyer.userId || {};
      return {
        _id: lawyer._id,
        id: String(lawyer._id),
        name: userInfo.name,
        email: userInfo.email,
        user: userInfo,
        city: lawyer.city || userInfo.city,
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
