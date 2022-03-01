import React from 'react'
import { Column } from '@ant-design/charts'
export default function BarGraph() {
	const data = [
		{
			type: 'January',
			sales: 10
		},
		{
			type: 'February',
			sales: 20
		},
		{
			type: 'March',
			sales: 30
		},
		{
			type: 'April',
			sales: 145
		},
		{
			type: 'May',
			sales: 48
		},
		{
			type: 'June',
			sales: 68
		},
		{
			type: 'July',
			sales: 54
		},
		{
			type: 'August',
			sales: 73
		},
		{
			type: 'September',
			sales: 90
		},
		{
			type: 'October',
			sales: 26
		},
		{
			type: 'November',
			sales: 7
		},
		{
			type: 'December',
			sales: 68
		}
	]
	const config = {
		data,
		xField: 'type',
		yField: 'sales',
		label: {
			// 可手动配置 label 数据标签位置
			position: 'middle',
			// 'top', 'bottom', 'middle',
			// 配置样式
			style: {
				fill: '#FFFFFF',
				opacity: 0.6
			}
		},
		xAxis: {
			label: {
				autoHide: true,
				autoRotate: false
			}
		},
		meta: {
			type: {
				alias: '类别'
			},
			sales: {
				alias: '销售额'
			}
		}
	}
	return <Column {...config} />
}
