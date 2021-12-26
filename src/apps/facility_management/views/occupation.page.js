import React from "react";
import Header from "../../../components/Header";
import Occupations from "../components/Occupations";

export default function OccupationPage() {
	return (
		<div>
			<Header title='Occupation' />
			<div className='-content-container'>
				<Occupations />
			</div>
		</div>
	);
}
