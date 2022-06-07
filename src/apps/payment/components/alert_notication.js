import { notification } from 'antd';
import { useSelector } from 'react-redux';
const AlertNotication = () => {
	const { alert_notification } = useSelector((state) => state.PaymentActionRedux);

	return (
		<div>
			{alert_notification !== null
				? notification[alert_notification.type]({
						duration: 2,
						message: alert_notification.message,
						description: alert_notification.description,
						style: { borderRadius: '25px' },
				  })
				: null}
		</div>
	);
};

export default AlertNotication;
