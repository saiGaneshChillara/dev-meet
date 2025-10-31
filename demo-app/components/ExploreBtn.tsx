"use client";

import Image from "next/image";
// import "../app/globals.css";

const ExploreBtn = () => {
	return (
		<button type="button" onClick={() => {}} id="explore-btn" className="mt-7 mx-auto">
			<a href="#events">
				Explore Events
				<Image src={"/icons/arrow-down.svg"} alt="arrow-down" width={24} height={24} />
			</a>
		</button>
	);
};

export default ExploreBtn;