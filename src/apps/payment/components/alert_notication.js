import { message, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
const AlertNotication = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { alert_notification } = useSelector((state) => state.PaymentActionRedux);
  // const DataAlert ={
  //     type:alert_notification.type !== null ||null,
  //     message:alert_notification.message,
  //     description:alert_notification.description
  // }

  return (
    <div>
      {alert_notification !== null
        ? notification[alert_notification.type]({
            duration: 2,
            message: alert_notification.message,
            description: alert_notification.description,
            style: { borderRadius: "25px" },
          })
        : null}
    </div>
  );
};

export default AlertNotication;
