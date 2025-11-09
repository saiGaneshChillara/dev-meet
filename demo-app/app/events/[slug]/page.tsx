import BookEvent from "@/components/BookEvent";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({ icon, alt, label }: { icon: string, alt: string, label: string }) => (
	<div className="flex-row-gap-2 items-center">
		<Image src={icon} alt={alt} width={17} height={17} />
		<p>{label}</p>
	</div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[]}) => (
	<div className="agenda">
		<h2>Agenda</h2>
		<ul>
			{cleanAgenda(agendaItems).map((item) => (
				<li key={item}>{item}</li>
			))}
		</ul>
	</div>
);

const cleanAgenda = (agenda: string[] | string): string[] => {
	if (Array.isArray(agenda)) {
		if (typeof agenda[0] === "string" && !agenda[0].trim().startsWith("[")) {
			return agenda;
		} else if (typeof agenda[0] === "string") {
			const cleaned = agenda[0].trim().replace(/,\s*$/,"");
			return JSON.parse(cleaned);
		}
	} else if (typeof agenda === "string") {
		const cleaned = agenda.trim().replace(/,\s*$/,"");
		return JSON.parse(cleaned);
	}
	return [];
};

const EventTags = ({ tags }: { tags: string[] }) => (
	<div className="flex flex-row gap-1.5 flex-wrap">
		{tags.map((tag) => (
			<div className="pill" key={tag}>{tag}</div>
		))}
	</div>
);

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }>}) => {
	const { slug } = await params;

	let event;
	try {
		const response = await fetch(`${BASE_URL}/api/events/${slug}`, { next: { revalidate: 60 }});

		if (!response.ok) {
			if (response.status === 404) {
				return notFound();
			}
			throw new Error(`Failed to fetch event: ${response.statusText}`);
		}

		const result = await response.json();
		event = result.event;

		if (!event) {
			return notFound();
		}
	} catch (error) {
		console.error("Error fetching event:", error);
		return notFound();
	}

	// const response = await fetch(`${BASE_URL}/api/events/${slug}`);
	// const { event: { description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } } = await response.json();
	const { description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } = event;

	const bookings = 10;

	if (!description) return notFound();
	return (
		<section id="event">
			<div className="header">
				<h1>Event Description</h1>
				<p>{description}</p>
			</div>
			<div className="details">
				<div className="content">
					<Image src={image} alt={"Event Image"} width={800} height={800} className="banner" />
					<section className="flex-col-gap-2">
						<h2>Overview</h2>
						<p>{overview}</p>
					</section>
					<section className="flex-col-gap-2">
						<h2>Event Details</h2>
						<EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
						<EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
						<EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
						<EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
						<EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
					</section>
					<EventAgenda agendaItems={agenda} />
					<section className="flex-col-gap-2">
						<h2>About the Organizer</h2>
						<p>{organizer}</p>
					</section>
					<EventTags tags={JSON.parse(tags[0])} />
				</div>
				<aside className="booking">
					<div className="signup-card">
						<h2>Book Your Spot</h2>
						{bookings > 0 ? (
							<p className="text-sm">Join {bookings} people who have already booked their spot!</p>
						) : (
							<p className="text-sm">Be the first to book your spot!</p>
						)}
						<BookEvent />
					</div>
				</aside>
			</div>
		</section>
	);
};

export default EventDetailsPage;