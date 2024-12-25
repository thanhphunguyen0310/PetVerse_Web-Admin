import { Result } from 'antd'

const TransactionSuccessful = () => {
    return (
        <Result
            status="success"
            title="Thanh toán nạp tiền vào hệ thống PetVerse thành công!"
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

export default TransactionSuccessful