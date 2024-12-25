import { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Checkbox, Flex, message, Upload, DatePicker } from 'antd';
import { UploadOutlined, DeleteOutlined, LoadingOutlined, PlusOutlined, DeleteFilled } from '@ant-design/icons';
import { updatePet } from '../../configs/api/pet';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const FormUpdatePet = ({ pet, setIsEditing, setIsModalVisible, fetchPet }) => {
    const { accessToken } = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState();
    const [form] = Form.useForm();
    const [petPhotosToDelete, setPetPhotosToDelete] = useState([]);

    const petImages = pet?.petPhotos?.filter(photo => photo.type === 0) || [];

    useEffect(() => {
        if (pet) {
            form.setFieldsValue({
                name: pet.name,
                birthDate: pet.birthDate ? dayjs(pet.birthDate, 'DD/MM/YYYY') : null,
                gender: pet.gender,
                weight: pet.weight,
                sterilized: pet.sterilized,
                description: pet.description,
            });
        }
    }, [pet, form]);

    const handleCancel = () => {
        setIsEditing(false);
    };
    const handlePhotoDeleteToggle = (photoId) => {
        setPetPhotosToDelete((prev) => {
            const updatedPhotosDelete = prev.includes(photoId)
                ? prev.filter((id) => id !== photoId)
                : [...prev, photoId];
            form.setFieldsValue({
                petPhotosToDelete: updatedPhotosDelete
            });
            return updatedPhotosDelete;
        });
    };

    const handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
            // Set avatarUrl with the selected image URL
            setAvatarUrl(URL.createObjectURL(info.file.originFileObj));
        }
    };
    const handleVideoUploadChange = (info) => {
        if (info.file.status === 'done') {
            message.success("Video đã được chọn thành công!");
        } else if (info.file.status === 'error') {
            message.error("Có lỗi xảy ra khi tải video!");
        }
    };
    const beforeUpload = (file) => {
        const imageType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg'
        if (!imageType) {
            message.error('Chỉ cháp nhận định dạng ảnh JPG/PNG/JPEG!');
            return Upload.LIST_IGNORE;
        }
        const imageSize = file.size / 1024 / 1024 < 1;
        if (!imageSize) {
            message.error('Ảnh phải nhỏ hơn 1MB!');
            return Upload.LIST_IGNORE;
        }
        return false;
    };
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );
    const onFinish = async () => {
        try {
            const values = form.getFieldsValue();
            const formData = new FormData();

            formData.append("Id", pet.id);
            formData.append("Name", values.name);
            formData.append("BirthDate", values.birthDate ? dayjs(values.birthDate).format('DD/MM/YYYY') : '');
            formData.append("Gender", values.gender);
            formData.append("Weight", values.weight);
            formData.append("Sterilized", values.sterilized);
            formData.append("Description", values.description);
            // Append avatar image as a file
            if (avatarUrl) {
                const avatarFile = values.avatar?.file?.originFileObj || avatarUrl;
                if (avatarFile instanceof File) {
                    formData.append("Avatar", avatarFile);
                } else {
                    console.warn("Avatar file is not valid.");
                }
            }
            // Append pet photos
            if (values.petPhotos && values.petPhotos.fileList) {
                values.petPhotos.fileList.forEach((file) => {
                    formData.append("PetPhotos", file.originFileObj);
                });
            }
            // Append pet video
            if (values.petVideos && values.petVideos.file) {
                values.petVideos.fileList.forEach((video) => {
                    formData.append("PetVideos", video.originFileObj);
                });
            }
            // Handle petPhotosToDelete
            if (values.petPhotosToDelete && values.petPhotosToDelete.length > 0) {
                values.petPhotosToDelete.forEach((photoId) => {
                    formData.append("PetPhotosToDelete", photoId);
                });
            }

            await updatePet(accessToken, pet.id, formData);
            message.success("Thông tin đã được cập nhật!");
            setIsEditing(false);
            setIsModalVisible(false);
            fetchPet();
        } catch (error) {
            message.error("Có lỗi xảy ra khi cập nhật!");
            console.error(error);
        }
    };
    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="avatar" label="Ảnh đại diện">
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleAvatarChange}
                    customRequest={({ file, onSuccess }) => {
                        setTimeout(() => {
                            onSuccess("ok");
                            message.success("Ảnh đã được chọn thành công!");
                        }, 0);
                    }}
                >
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: "100%", borderRadius: "4px" }} />
                    ) : (
                        uploadButton
                    )}
                </Upload>
            </Form.Item>
            <Form.Item name="name" label="Tên thú cưng" rules={[{ required: true, message: 'Vui lòng nhập tên thú cưng!' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="petPhotos" label="Ảnh của thú cưng"
            >
                <Upload
                    beforeUpload={beforeUpload}
                    customRequest={({ onSuccess }) => {
                        setTimeout(() => {
                            onSuccess("ok");
                            message.success("Ảnh đã được chọn thành công!");
                        }, 1000);
                    }}
                >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
            </Form.Item>
            <Form.Item name="petVideos" label="Video của thú cưng"
            >
                <Upload
                    accept="video/*"
                    onChange={handleVideoUploadChange}
                    customRequest={({ onSuccess }) => {
                        setTimeout(() => {
                            onSuccess("ok");
                        }, 1000);
                    }}
                >
                    <Button icon={<UploadOutlined />}>Chọn video</Button>
                </Upload>
            </Form.Item>
            <Form.Item
                rules={[
                    {
                        validator: (_, value) => {
                            // Convert to dayjs object to check if date is after today
                            if (value && dayjs(value).isAfter(dayjs())) {
                                return Promise.reject('Ngày sinh không thể lớn hơn hôm nay!');
                            }
                            return Promise.resolve();
                        },
                    },
                ]}
                label="Ngày sinh"
                name="birthDate"
            >
                <DatePicker
                    disabledDate={(current) => current && current.isAfter(dayjs())}
                    placeholder="Ngày sinh"
                    format={{
                        format: 'DD/MM/YYYY',
                        type: 'mask',
                    }}
                />
            </Form.Item>
            <Flex align='center' gap={16}>
                <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value={1}>Đực</Select.Option>
                        <Select.Option value={2}>Cái</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true, message: 'Vui lòng nhập cân nặng!' }]}>
                    <Input />
                </Form.Item>
            </Flex>
            <Form.Item name="sterilized" valuePropName="checked">
                <Checkbox>Đã triệt sản</Checkbox>
            </Form.Item>
            <Form.Item name="description" label="Mô tả thú cưng">
                <Input.TextArea />
            </Form.Item>

            {/* Display existing photos with delete option */}
            <Form.Item label="Ảnh hiện tại" name="petPhotosToDelete">
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {petImages.length > 0 ? (
                        petImages.map((photo) => (
                            <div key={photo.petPhotoId} style={{ position: 'relative' }}>
                                <img
                                    src={photo.url}
                                    alt="Pet"
                                    style={{ width: 100, height: 100, borderRadius: 4 }}
                                />
                                <Button
                                    type="text"
                                    icon={petPhotosToDelete.includes(photo.petPhotoId) ? <DeleteFilled style={{ color: "#D9363E" }} /> : <DeleteOutlined style={{ color: "#FF4D4F" }} />}
                                    onClick={() =>
                                        handlePhotoDeleteToggle(photo.petPhotoId)
                                    }
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                    }}
                                />
                            </div>
                        ))
                    ) : (
                        <p>Không có ảnh nào để hiển thị</p>
                    )}
                </div>
            </Form.Item>

            <Form.Item>
                <Flex justify='center' gap={12}>
                    <Button type="primary" htmlType="submit">Cập nhật</Button>
                    <Button onClick={handleCancel}>Hủy</Button>
                </Flex>
            </Form.Item>
        </Form>
    );
};

export default FormUpdatePet;
