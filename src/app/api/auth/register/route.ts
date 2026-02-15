// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";
import { LawyerModel } from "@/models/Lawyer";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {

  try {
    const body = await request.json().catch((err) => {
      throw new Error("Invalid JSON body");
    });


    const { name, email, password, role = "client" } = body;

    // Input validation
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "Validation failed.",
          error: "Name, email, and password are required.",
          received: { name, email, password: Boolean(password) },
        },
        { status: 400 }
      );
    }

    // DB connection
    try {
      await connectToDatabase();
    } catch (dbError: any) {
      return NextResponse.json(
        {
          message: "Failed to connect to the database.",
          error: dbError?.message || String(dbError),
        },
        { status: 500 }
      );
    }

    // Check if user exists
    try {
      const lookupEmail = String(email).toLowerCase();
      const existingUser = await UserModel.findOne({ email: lookupEmail }).lean().exec();

      if (existingUser) {
        return NextResponse.json(
          {
            message: "Duplicate email.",
            error: "An account with this email already exists.",
          },
          { status: 409 }
        );
      }
    } catch (lookupError: any) {
      return NextResponse.json(
        {
          message: "Failed to check for existing user.",
          error: lookupError?.message || String(lookupError),
        },
        { status: 500 }
      );
    }

    // Password hashing
    let hashed: string;
    try {
      hashed = await hashPassword(password);
    } catch (hashError: any) {
      return NextResponse.json(
        {
          message: "Password hashing failed.",
          error: hashError?.message || String(hashError),
        },
        { status: 500 }
      );
    }

    // Creating user
    let user;
    try {
      user = await UserModel.create({
        name,
        email: String(email).toLowerCase(),
        password: hashed,
        role,
      });
    } catch (createError: any) {

      // Detect duplicate key at DB level (race condition)
      if (createError?.code === 11000) {
        return NextResponse.json(
          {
            message: "Duplicate email (race condition).",
            error: createError?.message || "Duplicate key error",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          message: "Failed to create user.",
          error: createError?.message || String(createError),
          stack: process.env.NODE_ENV !== "production" ? createError?.stack : undefined,
        },
        { status: 500 }
      );
    }

    // If user is lawyer → create a lawyer profile with reference to userId
    if (role === "lawyer") {
      try {
        await LawyerModel.create({
          userId: user._id,
          specialization: "",
          category: "",
          experience: 0,
          city: "",
          languages: [],
          price: 0,
          availability: { dates: [], slots: [] },
          rating: { average: 0, totalRatings: 0, sum: 0 },
          profileStatus: "processing",
        });
      } catch (lawyerErr: any) {
        // Log but do not block registration (you can choose to fail instead)
      }
    }

    // Success
    try {
      const safeUser = typeof user?.toJSON === "function" ? user.toJSON() : user;
      // Generate JWT and set cookies
      const { signAuthToken, setAuthCookies } = await import("@/lib/auth");
      const token = signAuthToken({ sub: user._id.toString(), role: user.role });
      const response = NextResponse.json(
        {
          user: safeUser,
          message: "Registration successful.",
        },
        { status: 201 }
      );
      setAuthCookies(response, token, user.role);
      return response;
    } catch (toJSONError: any) {
      return NextResponse.json({ user, message: "Registration successful." }, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Unexpected server error.",
        error: error?.message || String(error),
        stack: process.env.NODE_ENV !== "production" ? error?.stack : undefined,
      },
      { status: 500 }
    );
  }
}
