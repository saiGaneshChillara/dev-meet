import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { events } from "@/lib/constants";

const Home = () => {
	return (
		<section>
			<h1 className="text-center">The Hub for Every Dev <br /> Event you can't miss</h1>
			<p className="text-center mt-5">Hackthons, Meetups and conferences, All in one place</p>

			<ExploreBtn />

			<div className="mt-20 space-y-7">
				<h3>Featured Events</h3>
				<ul className="events">
					{events.map((event) => (
						<li key={event.title}>
							<EventCard {...event} />
						</li>
					))}
				</ul>
			</div>
		</section>
	);
};

export default Home;