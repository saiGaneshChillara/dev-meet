import Event from "@/database/event.model";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloundinary } from "cloudinary";

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		await connectDB();

		const formData = await req.formData();

		console.log("Form data is", formData);

		let event;

		try {
			event = Object.fromEntries(formData.entries());
		} catch (e) {
			console.log("Event is", event);
			return NextResponse.json({ message: "Invalid data" }, { status: 400 });
		}

		const file = formData.get("image") as File;

		if (!file) {
			return NextResponse.json({ message: "Image file is required" }, { status: 400 });
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const uploadResult = await new Promise((resolve, reject) => {
			cloundinary.uploader.upload_stream({ resource_type: "image", folder: "DevEvent" }, (err, result) => {
				if (err) return reject(err);
				resolve(result);
			}).end(buffer);
		});

		event.image = (uploadResult as { secure_url: string }).secure_url;

		const createdEvent = await Event.create(event);

		return NextResponse.json({ message: "Event created successfully", event: createdEvent }, { status: 201 });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ message: "Event creation failed", error: e instanceof Error ? e.message : "Unknown" }, { status: 500 });
	}
};

export async function GET(): Promise<NextResponse> {
	try {
		await connectDB();

		const events = await Event.find().sort({ createdAt: -1 });

		return NextResponse.json({ message: "Events fetched successfully", events }, { status: 200 });
	} catch (e) {
		return NextResponse.json({ message: "Could not fetch events", error: e }, { status: 500 });
	}
};