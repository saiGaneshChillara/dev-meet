import Event, { IEvent } from "@/database/event.model";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
	params: Promise<{
		slug: string;
	}>;
};

export async function GET(req: NextRequest, { params }: RouteParams) {
	try {
		await connectDB();
		
		const { slug } = await params;

		if (!slug || typeof slug !== "string" || slug.trim() === "") {
			return NextResponse.json({ message: "Invalid/missing slug parameter" }, { status: 400 });
		}

		const sanitizedSlug = slug.trim().toLowerCase();

		const event = await Event.findOne({ slug: sanitizedSlug }).lean();

		if (!event) {
			return NextResponse.json({ message: "Event not found" }, { status: 404 });
		}

		return NextResponse.json({ message: "Event fetched successfully", event }, { status: 200 });
	} catch (e) {
		return NextResponse.json({ message: "Unexpected error occured" }, { status: 500 });
	}
};