import { Table, Tag } from 'antd';
import { useEffect, useState } from 'react'
import { summaryTable } from '../../../configs/api/dashboard';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import './RecentTransactionTable.css';
const RecentTransactionTable = () => {
  const { accessToken } = useSelector((state) => state.auth)
  const [recentTransactionData, setrecentTransactionData] = useState([]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  const transactionColumns = [
    {
      title: "Loại giao dịch",
      dataIndex: "title",
      key: "title",
      render: (text) => {
        let className = "";
        switch (text) {
          case "Cộng Tiền":
            className = "title-credit";
            break;
          case "Nạp tiền":
            className = "title-topup";
            break;
          case "Trừ Tiền":
            className = "title-debit";
            break;
          case "Hoàn tiền":
            className = "title-refund";
            break;
          case "Trả lương":
            className = "title-salary";
            break;
          default:
            className = "title-default";
            break;
        }
        return <span className={className}>{text}</span>;
      },
    },
    {
      title: "Ngày giao dịch",
      dataIndex: "date",
      key: "date",
      render: (date) => <span>{dayjs(date).format('HH:mm DD/MM/YYYY')}</span>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <span className="transaction-amount">{formatPrice(amount)}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === 2 ? "green" : "orange"}>
          {status === 2 ? "Thành công" : "Đang thanh toán"}
        </Tag>
      ),
    },
  ];

  const fetchRecentTransactions = async () => {
    try {
      const response = await summaryTable(accessToken);
      if (response.statusCode === 200) {
        setrecentTransactionData(response.data.recentPayments);
      } else {
        console.error('Failed to fetch recent transactions');
        setrecentTransactionData([]);
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchRecentTransactions();
  }, [])
  return (
    <div className="transaction-table-container">
      <h2 className="table-title">Giao dịch gần đây</h2>
      <Table
        dataSource={recentTransactionData}
        columns={transactionColumns}
        pagination={false}
        rowKey="index"
        className="custom-transaction-table"
      />
    </div>
  )
}
export default RecentTransactionTable