import React from "react";
import { Pie } from "@ant-design/charts";
export default function PieGraph() {
	const data = [
		{
			type: "New Co-Owner",
			value: 30
		},
		{
			type: "Co-Owner",
			value: 1470
		}
	];
	const config = {
		appendPadding: 10,
		data,
		angleField: "value",
		colorField: "type",
		radius: 0.9,
		label: {
			type: "inner",
			offset: "-30%",
			content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
			style: {
				fontSize: 14,
				textAlign: "center"
			}
		},
		interactions: [
			{
				type: "element-active"
			}
		]
	};
	return <Pie {...config} />;
}
