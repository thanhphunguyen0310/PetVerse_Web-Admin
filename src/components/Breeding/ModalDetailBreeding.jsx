import { Button, Image, Divider, Descriptions, Flex, Tooltip, Tag, notification, Modal, Input } from 'antd';
import { updateBreedingApplication } from '../../configs/api/breeding';
import { useSelector } from 'react-redux';
const { TextArea } = Input;
const ModalDetailBreeding = ({ breeding, setIsModalVisible, fetchBreedingList }) => {
    const { accessToken } = useSelector((state) => state.auth);

    if (!breeding) return null; // Handle the case when breeding data is not yet loaded

    // Map status code to a readable status text
    const getStatusTag = (status) => {
        let statusText = '';
        let color = '';

        switch (status) {
            case 1:
                statusText = 'Đang xử lí';
                color = 'orange';
                break;
            case 2:
                statusText = 'Chấp nhận';
                color = 'blue';
                break;
            case -1:
                statusText = 'Từ chối';
                color = 'red';
                break;
            default:
                statusText = 'Không rõ';
                color = 'gray';
        }

        return <Tag color={color}>{statusText}</Tag>;
    };
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };
    const handleAccept = (breedingId) => {
        let cancelReason = "";
        // Show confirmation modal for acceptance
        Modal.confirm({
            title: "Xác nhận Chấp nhận đơn đăng ký",
            content: "Bạn có chắc muốn chấp nhận đơn đăng ký này?",
            okText: "Ok",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    await updateBreedingApplication(accessToken, breedingId, 2, cancelReason); // Update status to '2' for accepted
                    notification.success({
                        message: "Thành công",
                        description: "Đơn đăng ký đã được chấp nhận.",
                        placement: "topRight",
                        duration: 2,
                    });
                    setIsModalVisible(false);
                    fetchBreedingList(); // Refresh the breeding list after successful update
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi khi cập nhật đơn đăng ký.",
                        placement: "topRight",
                        duration: 2,
                    });
                    console.error("Error updating application:", error);
                }
            },
        });
    };
    const handleReject = (breedingId) => {
        let cancelReason = "";
        // Show modal for entering cancel reason
        Modal.confirm({
            title: "Xác nhận Từ chối đơn đăng ký",
            content: (
                <TextArea
                    placeholder="Lý do từ chối"
                    onChange={(e) => (cancelReason = e.target.value)}
                    rows={4}
                />
            ),
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    await updateBreedingApplication(accessToken, breedingId, -1, cancelReason); // Update status to '-1' for rejected
                    notification.success({
                        message: "Thành công",
                        description: "Đơn đăng ký đã bị từ chối.",
                        placement: "topRight",
                        duration: 2,
                    });
                    setIsModalVisible(false); // Close modal after successful update
                    fetchBreedingList();
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi khi cập nhật đơn đăng ký.",
                        placement: "topRight",
                        duration: 2,
                    });
                    console.error("Error updating application:", error);
                }
            },
        });
    };
    return (
        <>
            <Descriptions column={1}
                bordered
                size="large"
                labelStyle={{ fontWeight: "bold", width: "150px", whiteSpace: "nowrap" }}
                contentStyle={{ fontSize: "16px", minWidth: "120px" }}>
                <Descriptions.Item label="ID">{breeding.id}</Descriptions.Item>
                <Descriptions.Item label="Tên trung tâm">{breeding.petCenterName}</Descriptions.Item>
                <Descriptions.Item label="Tên">{breeding.name}</Descriptions.Item>
                <Descriptions.Item label="Loài">{breeding.speciesId === 1 ? "Chó" : "Mèo"}</Descriptions.Item>
                <Descriptions.Item label="Mô tả">{breeding.description}</Descriptions.Item>
                <Descriptions.Item label="Giá tiền">{formatPrice(breeding.price)}</Descriptions.Item>
                {/* Display pet image if available */}
                <Descriptions.Item label="Hình ảnh">
                    {breeding.images && breeding.images.length > 0 ? (
                        <Image.PreviewGroup>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                                {breeding.images.map((img, index) => (
                                    <Image
                                        key={img.centerBreedImageId || index}
                                        src={img.image}
                                        preview={{
                                            mask: (
                                                <span style={{
                                                    color: "#fff",
                                                    padding: "4px 8px",
                                                    borderRadius: "4px"
                                                }}>Xem ảnh</span>
                                            )
                                        }}
                                        alt={`Pet Image ${index + 1}`}
                                        width={120}
                                        style={{ height: 120, objectFit: 'cover', borderRadius: "4px", border: "1px solid #81818a" }}
                                    />
                                ))}
                            </div>
                        </Image.PreviewGroup>
                    ) : (
                        <p>Không có hình ảnh</p>
                    )}

                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">{getStatusTag(breeding.status)}</Descriptions.Item>
                {breeding?.cancelReason && breeding.cancelReason !== "" ? (
                    <Descriptions.Item label="Lý do từ chối">{breeding.cancelReason}</Descriptions.Item>
                ) : null}
            </Descriptions>

            <Divider />

            {/* Button to edit the breeding details */}
            {breeding.status === 2 || breeding.status === -1 ? null :
                <Flex justify='center' align='center' gap={12} style={{ marginTop: "12px" }}>
                    <Button type="primary" onClick={() => handleAccept(breeding.id)}>
                        Chấp nhận
                    </Button>
                    <Button type="primary" danger onClick={() => handleReject(breeding.id)}>
                        Từ chối
                    </Button>
                </Flex>
            }

        </>
    );
};

export default ModalDetailBreeding;
