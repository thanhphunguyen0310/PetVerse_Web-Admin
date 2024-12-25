import { Result } from 'antd'

const TransactionFail = () => {
  return (
    <Result
    status="error"
    title="Lỗi thanh toán nạp tiền!"
    // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
    // extra={[
    //     <Button type="primary" key="console">
    //         Go Console
    //     </Button>,
    //     <Button key="buy">Buy Again</Button>,
    // ]}
/>
  )
}

export default TransactionFail