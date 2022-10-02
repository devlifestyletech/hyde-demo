import React,{useEffect,useState} from "react";
// import { pie_data } from "./utils/graph.data";
import { Pie } from "@ant-design/charts";
import{GetCountBills} from '../../services/API/PaymentAPI'
export default function PieChart() {
	const[pie_data,setPie_data]=useState(null)
	useEffect(async () => {
		const data=await GetCountBills()
 await	setPie_data(data)
	  }, []);
	const config = {
		appendPadding: 10,
		data: pie_data ?pie_data:[],
		angleField: 'total',
		colorField: '_id',
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
