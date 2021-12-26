import gymImg from "../assets/img/gym.png";
import poolImg from "../assets/img/sky-pool.png";
import noImg from "../assets/img/no_img.png";

export const occupations = [
	{
		id: "1",
		room_name: "Gym",
		room_detail: "For Exercise",
		image: gymImg,
		low_status: 0,
		medium_status: 10,
		high_status: 15,
		status_now: 0
	},
	{
		id: "2",
		room_name: "Sky Pool",
		room_detail: "For Exercise",
		image: poolImg,
		low_status: 0,
		medium_status: 10,
		high_status: 15,
		status_now: 1
	},
	{
		id: "3",
		room_name: "Yoga",
		room_detail: "For Exercise",
		image: noImg,
		low_status: 0,
		medium_status: 10,
		high_status: 15,
		status_now: 2
	},
	{
		id: "4",
		room_name: "Kids’ Learning Space",
		room_detail: "For Exercise",
		image: noImg,
		low_status: 0,
		medium_status: 10,
		high_status: 15,
		status_now: 2
	}
];
