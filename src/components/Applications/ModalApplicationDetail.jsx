import { Descriptions, Flex, Image, Tag } from "antd"

const ModalApplicationDetail = ({ selectedApplication }) => {
    return (
        <>
            <Descriptions
                column={1}
                bordered
                size="large"
                labelStyle={{ fontWeight: "bold", width: "150px", whiteSpace: "nowrap" }}
                contentStyle={{ fontSize: "16px", minWidth: "120px" }}>
                <Descriptions.Item label="ID">
                    {selectedApplication.id}
                </Descriptions.Item>
                <Descriptions.Item className="user-image" label="Hình ảnh">
                    <Image
                        alt={selectedApplication.name}
                        style={{
                            borderRadius: "50%",
                            border: "1px solid #b8b0b0",
                            objectFit: "cover",
                        }}
                        preview={{
                            mask: <span style={{
                                color: "#fff",
                                backgroundColor: "rgba(0, 0, 0, 0.6)",
                                padding: "4px 8px",
                                borderRadius: "4px"
                            }}>Xem ảnh</span>
                        }}
                        width={100}
                        height={100}
                        src={selectedApplication.avatar}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="Họ và tên">
                    {selectedApplication.name}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                    {selectedApplication.phoneNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                    {selectedApplication.address}
                </Descriptions.Item>
                <Descriptions.Item label="Chi tiết">
                    {selectedApplication.description}
                </Descriptions.Item>
                <Descriptions.Item className="user-certification" label="Chứng nhận">
                    <Flex wrap="wrap" gap={16} justify="flex-start">
                        {selectedApplication.certifications.map((cert, index) => (
                            <Image
                                key={cert}
                                src={cert}
                                alt={`Chứng nhận ${index + 1}`}
                                preview={{
                                    mask: <span style={{
                                        color: "#fff",
                                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                                        padding: "4px 8px",
                                        borderRadius: "4px"
                                    }}>Xem ảnh</span>
                                }}
                                style={{
                                    border: "1px solid #b8b0b0",
                                    maxWidth: "100px",
                                    objectFit: "cover",
                                    marginBottom: "16px",
                                    position: "relative",
                                    width: "100px",
                                    height: "120px",
                                }}
                            />
                        ))}
                    </Flex>
                </Descriptions.Item>
                <Descriptions.Item label="Dịch vụ">
                    {selectedApplication.applicationPetServices.map((service) => {
                        let serviceText = "";
                        let color = "";

                        // Map the service type to a specific label and color
                        switch (service.petServiceId) {
                            case 1: // Pet Care
                                serviceText = "Trông thú";
                                color = "green";
                                break;
                            case 2: // Training
                                serviceText = "Huấn luyện";
                                color = "blue";
                                break;
                            case 3: // Spa Service
                                serviceText = "Dịch vụ spa";
                                color = "purple";
                                break;
                            case 4:
                                serviceText = "Bác sĩ thú y";
                                color = "red";
                                break;
                            default:
                                serviceText = "Dịch vụ không rõ";
                                color = "gray";
                        }

                        return (
                            <Tag
                                key={service.petServiceId}
                                color={color}
                                style={{ margin: "4px" }}
                            >
                                {serviceText}
                            </Tag>
                        );
                    })}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    {(() => {
                        let statusText = "";
                        let color = "";

                        // Retrieve the status from selectedApplication
                        const status = selectedApplication.status;

                        // Map the status to a specific label and color
                        switch (status) {
                            case 1:
                                statusText = "Đang xử lí";
                                color = "orange";
                                break;
                            case 2:
                                statusText = "Chấp nhận";
                                color = "blue";
                                break;
                            case -1:
                                statusText = "Từ chối";
                                color = "red";
                                break;
                            default:
                                statusText = "Không rõ";
                                color = "gray";
                        }

                        return <Tag color={color}>{statusText}</Tag>;
                    })()}
                </Descriptions.Item>
            </Descriptions>
        </>
    )
}

export default ModalApplicationDetail