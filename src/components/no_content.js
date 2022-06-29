import React from 'react';
import { Empty, Button } from 'antd';
function NoContent() {
  return (
    <div
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 250,
      }}
    >
      <center>
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 100,
          }}
          description={<span>Not Found any content here !</span>}
        />
        <Button
          type="primary"
          shape="round"
          size="large"
          onClick={() => window.location.assign(`/dashboard/summary`)}
        >
          Go Back
        </Button>
      </center>
    </div>
  );
}

export default NoContent;
