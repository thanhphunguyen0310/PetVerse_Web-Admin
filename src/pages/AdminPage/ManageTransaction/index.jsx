import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Flex, Modal, Pagination, Spin, Table, Tag, Tooltip, Typography } from 'antd';
import { getTransaction, getTransactionDetail } from '../../../configs/api/transaction';
import ModalTransactionDetail from '../../../components/Transaction/ModalTransactionDetail';
import dayjs from "dayjs";

const { Title } = Typography;

const ManageTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  // const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([])
  // const [selectedTransaction, setSelectedTransaction] = useState(null);

  const { accessToken } = useSelector((state) => state.auth);

  const fetchTransactionList = async (page, pageSize) => {
    try {
      setIsLoading(true);
      const response = await getTransaction(accessToken, page, pageSize);
      setTransactions(response.data.items);
      setTotal(response.data.totalCount);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  // const fetchTransactionDetail = async (transactionId) => {
  //   try {
  //     setIsLoading(true);
  //     const response = await getTransactionDetail(transactionId, accessToken);
  //     setSelectedTransaction(response.data);
  //     setIsModalVisible(true);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  useEffect(() => {
    fetchTransactionList(currentPage, pageSize);
  }, [currentPage, pageSize])
  // Function to handle row click and show modal
  // const handleRowClick = async (record) => {
  //   fetchTransactionDetail(record.id);
  // };
  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    fetchTransactionList(page, pageSize, searchTerm);
  };
  // Function to handle modal close
  // const handleModalClose = () => {
  //   setIsModalVisible(false);
  //   setSelectedTransaction(null);
  // };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  const columns = [
    {
      title: "STT",
      key: "index",
      align: "center",
      render: (text, record, index) => index + 1,
      width: 50,
    },
    {
      title: "Mã giao dịch",
      dataIndex: "orderCode",
      align: "center",
      width: 80,
    },
    {
      title: "Loại giao dịch",
      dataIndex: "title",
      filters: [
        { text: "Nạp tiền", value: "Nạp tiền" },
        { text: "Trừ tiền", value: "Trừ Tiền" },
        { text: "Cộng tiền", value: "Cộng Tiền" },
        { text: "Hoàn tiền", value: "Hoàn Tiền" },
      ],
      onFilter: (value, record) => record.title === value,
      render: (title) => {
        let color = "";
        switch (title) {
          case "Nạp tiền":
            color = "blue";
            break;
          case "Trừ Tiền":
            color = "red";
            break;
          case "Cộng Tiền":
            color = "green";
            break;
          case "Hoàn Tiền":
            color = "orange";
            break;
          default:
            color = "gray";
        }
        return <Flex justify='center'>
          <Tag color={color}><span style={{ fontSize: "12px", fontWeight: "500" }}>{title}</span></Tag>
        </Flex>;
      },
      align: "center",
      ellipsis: true,
      width: 150,
    },
    {
      title: <Flex justify='center'>Số tiền</Flex>,
      dataIndex: "amount",
      render: (amount, record) => (
        <Flex justify='center' style={{ fontWeight: "500", color: record.isMinus ? "red" : "green" }}>
          {record.isMinus ? "-" : "+"}{formatPrice(amount)}
        </Flex>
      ),
      width: 120,
    },
    {
      title: "Ngày giao dịch",
      dataIndex: "createdDate",
      render: (createdDate) => {
        const formattedDate = dayjs(createdDate, "DD/MM/YYYY HH:mm");
        return formattedDate.isValid() ? (
          <Tooltip title={formattedDate.format("HH:mm DD/MM/YYYY")}>
            {formattedDate.format("HH:mm DD/MM/YYYY")}
          </Tooltip>
        ) : (
          "Invalid Date"
        );
      },
      align: "center",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: [
        { text: "Chưa thực hiện", value: 1 },
        { text: "Đã thực hiện", value: 2 },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === 1 ? "red" : "green"}>
          {status === 1 ? "Chưa thực hiện" : "Đã thực hiện"}
        </Tag>
      ),
      align: "center",
      width: 150,
    },
  ];
  return (
    <>
      <Flex style={{ flexDirection: "column" }} gap={16}>
        {/* Table display data */}
        {isLoading ? (
          <Spin size='large' />
        ) : (
          <Table
            columns={columns}
            dataSource={transactions}
            pagination={false}
            showSorterTooltip={{
              target: "sorter-icon",
            }}
          // onRow={(record) => ({
          //   onClick: () => handleRowClick(record),
          // })}
          />
        )}
        {/* Custom Pagination */}
        <Flex justify="flex-end">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            showSizeChanger={false}
            onChange={handlePaginationChange}
          />
        </Flex>
      </Flex>
      {/* <Modal
        title={
          <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
            Thông tin chi tiết
          </Title>
        }
        width={700}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={false}
        centered
      >
        <ModalTransactionDetail selectedTransaction={selectedTransaction} setIsModalVisible={setIsModalVisible} fetchTransactionList={fetchTransactionList} />
      </Modal> */}
    </>
  )
}

export default ManageTransaction
