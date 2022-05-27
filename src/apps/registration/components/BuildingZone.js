import React, { useState, useEffect } from 'react';
import { Empty, Space } from 'antd';
import './styles/building_zone.css';
import Addresses from './Addresses';

export default function BuildingZone({ floorsData }) {
	const [residences, setResidences] = useState(null);

	useEffect(() => {
		(async () => {
			setResidences(floorsData);
		})();
	}, [floorsData]);

	return (
		<>
			<div className='zone-build'>
				{residences ? (
					<Space size={[20, 24]} wrap>
						{residences.map((residence, idx) => (
							<div key={idx}>
								<Addresses data={residence} />
							</div>
						))}
					</Space>
				) : (
					<Empty />
				)}
			</div>
		</>
	);
}
