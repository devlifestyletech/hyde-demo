import libraryImg from "../assets/img/Library.png";
import coWork from "../assets/img/CoWorking.png";
import privateChef from "../assets/img/PrivateChef.png";
import spa from "../assets/img/Spa.png";
import theater from "../assets/img/theater.png";
import glass from "../assets/img/Glasshouse.png";
import golf from "../assets/img/golfSim.png";

export const facilities = [
	{
		room_name: "Private Chef Table",
		room_detail: "For Dining",
		img: privateChef,
		max_hours: 2,
		max_users: 10,
		dialy_start_time: "08.00",
		dialy_end_time: "10.00",
		accommodates: "Air - Condition, Table, Coffee Table, Chairs, Arm Chairs, Sofa",
		description:
			"Whether you’re looking for some worthwhile literature - all while hanging out in a sleek, modern space - this library will not disappoint. ",
		rules: "No food or drinks allowed",
		locked: false,
		users: 0
	},
	{
		room_name: "Library",
		room_detail: "For Reading",
		img: libraryImg,
		max_hours: 2,
		max_users: 10,
		dialy_start_time: "08.00",
		dialy_end_time: "10.00",
		accommodates: "Air - Condition, Table, Coffee Table, Chairs, Arm Chairs, Sofa",
		description:
			"Whether you’re looking for some worthwhile literature - all while hanging out in a sleek, modern space - this library will not disappoint. ",
		rules: "No food or drinks allowed",
		locked: true,
		users: 8
	},
	{
		room_name: "Co-working Space",
		room_detail: "For Working and Meeting",
		img: coWork,
		max_hours: 2,
		max_users: 10,
		dialy_start_time: "08.00",
		dialy_end_time: "10.00",
		accommodates: "Air - Condition, Table, Coffee Table, Chairs, Arm Chairs, Sofa",
		description:
			"Whether you’re looking for some worthwhile literature - all while hanging out in a sleek, modern space - this library will not disappoint. ",
		rules: "No food or drinks allowed",
		locked: false,
		users: 0
	},
	{
		room_name: "Theater Room",
		room_detail: "For Watching Movies",
		img: theater,
		max_hours: 2,
		max_users: 10,
		dialy_start_time: "08.00",
		dialy_end_time: "10.00",
		accommodates: "Air - Condition, Table, Coffee Table, Chairs, Arm Chairs, Sofa",
		description:
			"Whether you’re looking for some worthwhile literature - all while hanging out in a sleek, modern space - this library will not disappoint. ",
		rules: "No food or drinks allowed",
		locked: false,
		users: 0
	},
	{
		room_name: "Glass House",
		room_detail: "For Outdoor Experience",
		img: glass,
		max_hours: 2,
		max_users: 10,
		dialy_start_time: "08.00",
		dialy_end_time: "10.00",
		accommodates: "Air - Condition, Table, Coffee Table, Chairs, Arm Chairs, Sofa",
		description:
			"Whether you’re looking for some worthwhile literature - all while hanging out in a sleek, modern space - this library will not disappoint. ",
		rules: "No food or drinks allowed",
		locked: false,
		users: 0
	},
	{
		room_name: "Golf Simulator",
		room_detail: "For Golf Simulator",
		img: golf,
		max_hours: 2,
		max_users: 10,
		dialy_start_time: "08.00",
		dialy_end_time: "10.00",
		accommodates: "Air - Condition, Table, Coffee Table, Chairs, Arm Chairs, Sofa",
		description:
			"Whether you’re looking for some worthwhile literature - all while hanging out in a sleek, modern space - this library will not disappoint. ",
		rules: "No food or drinks allowed",
		locked: false,
		users: 0
	},
	{
		room_name: "Spa, Manicure & Pedicure",
		room_detail: "For Spa, Manicure & Pedicure",
		img: spa,
		max_hours: 2,
		max_users: 10,
		dialy_start_time: "08.00",
		dialy_end_time: "10.00",
		accommodates: "Air - Condition, Table, Coffee Table, Chairs, Arm Chairs, Sofa",
		description:
			"Whether you’re looking for some worthwhile literature - all while hanging out in a sleek, modern space - this library will not disappoint. ",
		rules: "No food or drinks allowed",
		locked: false,
		users: 0
	}
];
