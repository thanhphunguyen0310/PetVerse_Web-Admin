import { useSelector } from 'react-redux';
import { getUserDetails } from '../../configs/api/user';
import { useEffect, useState } from 'react';
import { Descriptions, Tag } from 'antd';
import dayjs from "dayjs";
const ModalTransactionDetail = ({ selectedTransaction, setIsModalVisible, fetchTransactionList }) => {
    const { accessToken } = useSelector((state) => state.auth);
    const [userName, setUserName] = useState("")


    const getUserInfo = async () => {
        const userId = selectedTransaction.userId
        const response = await getUserDetails(accessToken, userId);
        setUserName(response.data.fullName);
    }

    useEffect(() => {
        getUserInfo();
    }, [selectedTransaction])
    if (!selectedTransaction) return null;
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };
    const formattedDate = dayjs(selectedTransaction.createdDate, "DD/MM/YYYY HH:mm");
    return (
        <Descriptions
            bordered
            size="large"
            column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }}
            labelStyle={{ fontWeight: "bold", width: "150px", whiteSpace: "nowrap" }}
            contentStyle={{ fontSize: "16px", minWidth: "120px" }}
        >
            <Descriptions.Item label="Loại giao dịch">
                {selectedTransaction.title}
            </Descriptions.Item>
            <Descriptions.Item label="Mã giao dịch">
                {selectedTransaction.orderCode}
            </Descriptions.Item>
            <Descriptions.Item label="Người thực hiện">
                {userName}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày giao dịch">
                {formattedDate.format("HH:mm DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item span={2} label="Số tiền">
                {formatPrice(selectedTransaction.amount)}
            </Descriptions.Item>
            <Descriptions.Item span={2} label="Trạng thái">
                <Tag color={selectedTransaction.status === 1 ? "red" : "green"}>
                    {selectedTransaction.status === 1 ? "Chưa thực hiện" : "Đã thực hiện"}
                </Tag>
            </Descriptions.Item>
        </Descriptions>
    )
}

export default ModalTransactionDetail