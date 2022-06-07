import React from "react";
import { pie_data } from "./utils/graph.data";
import { Pie } from "@ant-design/charts";

export default function PieChart() {
	
	const config = {
		appendPadding: 10,
		data: pie_data,
		angleField: 'Bills',
		colorField: 'status',
		color:["#20263a","#d1ba7d","#d8aa81","#FAEDCA"],
		radius: 0.8,
		label: {
		  type: 'outer',
		  content: '{name} {percentage}',
		},
		interactions: [
		  {
			type: 'pie-legend-active',
		  },
		  {
			type: 'element-active',
		  },
		],
	};
	return <Pie {...config} />;
}
