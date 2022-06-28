import React, { useEffect, useState } from "react";
import { bar_data } from "./utils/graph.data";
import { Column } from "@ant-design/charts";
import{getCountBillsOfmonth} from '../../services/API/payment_api'

export default function GraphReserves() {
	const [dataOfMonth,setDataOfMonth]=useState(null)
	useEffect(async()=>{
	const result=await	getCountBillsOfmonth()
	await setDataOfMonth(result)
	},[])
	const config = {
		data: dataOfMonth ?dataOfMonth:[],
		xField: "_id",
		yField: "total",
	};

	return <Column {...config} />;
}
