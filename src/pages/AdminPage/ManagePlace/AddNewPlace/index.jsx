import { useState, useEffect } from "react";
import { Input, Button, Form, Switch, Select, message, Flex, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import mapboxgl from "mapbox-gl";
import ReactMapGl, { GeolocateControl, NavigationControl, FullscreenControl, Marker } from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { createPlace } from "../../../../configs/api/place";
import { useSelector } from "react-redux";
// import { GoogleMap, Marker, useLoadScript, DirectionsRenderer } from "@react-google-maps/api";

// Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_ACCESS_TOKEN;

const CreateNewPlace = () => {
    const { accessToken } = useSelector((state) => state.auth);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [viewport, setViewport] = useState({
        latitude: 10.8231,
        longitude: 106.6297,
        zoom: 12,
    });
    const [address, setAddress] = useState("");

    // Load Google Maps API
    // const { isLoaded } = useLoadScript({
    //     googleMapsApiKey: googleMapsApiKey,
    //     libraries: ["places"], 
    // });
    // if (!isLoaded) return <div>Loading...</div>;
    // for map box
    const handleSearch = (value) => {
        // Use geocoding API to convert address to lat/lng and update map
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=${mapboxgl.accessToken}`;
        fetch(geocodeUrl)
            .then((res) => res.json())
            .then((data) => {
                if (data?.features?.length > 0 && data.features[0]?.center) {
                    const { center } = data.features[0];
                    setViewport({
                        latitude: center[1],
                        longitude: center[0],
                        zoom: 18,
                    });
                    setAddress(value);
                    form.setFieldsValue({ Address: value });
                } else {
                    message.error("Không tìm thấy địa chỉ.");
                }
            });
    };
    // for gg map
    // const handleSearch = (value) => {
    //     // Use Google Maps Geocoding API to convert address to lat/lng
    //     const geocoder = new window.google.maps.Geocoder();
    //     geocoder.geocode({ address: value }, (results, status) => {
    //         if (status === "OK") {
    //             const { lat, lng } = results[0].geometry.location;
    //             setViewport({
    //                 lat: lat(),
    //                 lng: lng(),
    //                 zoom: 18,
    //             });
    //             setAddress(value);
    //             form.setFieldsValue({ Address: value });
    //         } else {
    //             message.error("Không tìm thấy địa chỉ.");
    //         }
    //     });
    // };
    // for map box
    const handleMapClick = (event) => {
        const { lngLat } = event;
        if (lngLat) {
            const { lng, lat } = lngLat;
            // Reverse geocoding to get the address based on lat/lng
            const reverseGeocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`;
            fetch(reverseGeocodeUrl)
                .then((res) => res.json())
                .then((data) => {
                    if (data?.features?.length > 0 && data.features[0]?.place_name) {
                        const newAddress = data.features[0].place_name;
                        setAddress(newAddress);
                        setViewport({
                            latitude: lat,
                            longitude: lng,
                            zoom: 18,
                        });
                        form.setFieldsValue({ Address: newAddress }); // Update the input field with the address
                    }
                });
        } else {
            message.error("Không tìm thấy địa chỉ.");
        }
    };
    // for gg map
    // const handleMapClick = (event) => {
    //     const { latLng } = event;
    //     if (latLng) {
    //         const lat = latLng.lat();
    //         const lng = latLng.lng();
    //         const geocoder = new window.google.maps.Geocoder();
    //         geocoder.geocode({ location: { lat, lng } }, (results, status) => {
    //             if (status === "OK" && results[0]) {
    //                 setAddress(results[0].formatted_address);
    //                 setViewport({
    //                     lat,
    //                     lng,
    //                     zoom: 18,
    //                 });
    //                 form.setFieldsValue({ Address: results[0].formatted_address });
    //             } else {
    //                 message.error("Không tìm thấy địa chỉ.");
    //             }
    //         });
    //     } else {
    //         message.error("Không tìm thấy địa chỉ.");
    //     }
    // };
    // for map box
    const handleSubmit = async (values) => {
        const { Type, Name, Address, Description, IsFree, SpeciesIds, Image } = values;

        const formData = new FormData();

        formData.append("Type", Type);
        formData.append("Name", Name);
        formData.append("Address", Address);
        formData.append("Description", Description);
        formData.append("IsFree", IsFree ? IsFree : false);

        if (viewport?.latitude && viewport?.longitude) {
            formData.append("Lat", String(viewport.latitude));
            formData.append("Lng", String(viewport.longitude));
        } else {
            console.error("Viewport latitude or longitude is not defined");
        }
        SpeciesIds.forEach((id) => {
            formData.append("SpeciesIds", id); // Assuming species is an array
        });

        if (Image?.fileList?.length > 0) {
            Image.fileList.forEach((file) => {
                formData.append("Image", file.originFileObj);
            });
        }

        try {
            await createPlace(accessToken, formData);
            message.success("Tạo mới địa điểm thành công!");
            form.resetFields(); // Reset form fields
            setFileList([]); // Clear image
        } catch (error) {
            message.error("Có lỗi xảy ra khi tạo địa điểm.");
        }
    };
    // for gg map
    // const handleSubmit = async (values) => {
    //     const { Type, Name, Address, Description, IsFree, SpeciesIds, Image } = values;

    //     const formData = new FormData();
    //     formData.append("Type", Type);
    //     formData.append("Name", Name);
    //     formData.append("Address", Address);
    //     formData.append("Description", Description);
    //     formData.append("IsFree", IsFree ? IsFree : false);
    //     formData.append("Lat", String(viewport.lat));
    //     formData.append("Lng", String(viewport.lng));

    //     SpeciesIds.forEach((id) => {
    //         formData.append("SpeciesIds", id);
    //     });

    //     if (Image?.fileList?.length > 0) {
    //         Image.fileList.forEach((file) => {
    //             formData.append("Image", file.originFileObj);
    //         });
    //     }

    //     try {
    //         await createPlace(accessToken, formData);
    //         message.success("Tạo mới địa điểm thành công!");
    //         form.resetFields(); // Reset form fields
    //         setFileList([]); // Clear image
    //     } catch (error) {
    //         message.error("Có lỗi xảy ra khi tạo địa điểm.");
    //     }
    // };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Flex justify="flex-start" gap={24} align="center">
                    <Form.Item label="Loại hình" name="Type">
                        <Select placeholder="Chọn loại hình">
                            <Select.Option value={1}>Công viên</Select.Option>
                            <Select.Option value={2}>Hồ bơi</Select.Option>
                            <Select.Option value={3}>Quán cafe</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Tên" name="Name">
                        <Input placeholder="Nhập tên" />
                    </Form.Item>
                </Flex>
                <Form.Item label="Hình ảnh" name="Image">
                    <Upload
                        fileList={fileList}
                        beforeUpload={(file) => {
                            const isImage =
                                file.type === "image/png" ||
                                file.type === "image/jpeg" ||
                                file.type === "image/jpg";
                            if (!isImage) {
                                message.error("Chỉ chấp nhận ảnh PNG, JPG, hoặc JPEG!");
                                return Upload.LIST_IGNORE;
                            }
                            const imageSize = file.size / 1024 / 1024 < 1;
                            if (!imageSize) {
                                message.error('Ảnh phải nhỏ hơn 1MB!');
                                return Upload.LIST_IGNORE;
                            }
                            setFileList([file]);
                            form.setFieldsValue({ avatar: file });
                            message.success("Ảnh đã được chọn thành công!");
                            return false;
                        }}
                        onRemove={() => {
                            setFileList([]);
                            form.setFieldsValue({ avatar: null });
                            message.info("Ảnh đã bị xóa!");
                        }}
                    >
                        <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                    </Upload>
                </Form.Item>
                <Form.Item label="Địa chỉ" name="Address">
                    <Input.Search
                        placeholder="Địa chỉ"
                        onSearch={handleSearch}
                        enterButton
                    />
                </Form.Item>

                <Form.Item label="Mô tả" name="Description">
                    <Input.TextArea rows={4} placeholder="Nhập mô tả" />
                </Form.Item>

                <Form.Item label="Miễn phí" name="IsFree" valuePropName="checked" initialValue={false}>
                    <Switch
                        onChange={(checked) => form.setFieldsValue({ IsFree: checked })}
                    />
                </Form.Item>

                <Form.Item label="Thích hợp với: " name="SpeciesIds">
                    <Select allowClear mode="multiple" placeholder="Chọn loài">
                        <Select.Option value={1}>Chó</Select.Option>
                        <Select.Option value={2}>Mèo</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Flex justify="center">
                        <Button type="primary" htmlType="submit">
                            Tạo mới
                        </Button>
                    </Flex>
                </Form.Item>
            </Form>
            <div style={{ width: '100%', height: '400px', marginTop: '20px' }}>
                {/* <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={{ lat: viewport.lat, lng: viewport.lng }}
                    zoom={viewport.zoom}
                    onClick={handleMapClick}
                >
                    <Marker position={{ lat: viewport.lat, lng: viewport.lng }} />
                </GoogleMap> */}
                <ReactMapGl
                    {...viewport}
                    width="100%"
                    height="100%"
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    // onViewportChange={(newViewport) => setViewport(newViewport)}
                    onMove={(event) => setViewport(event.viewState)}
                    onClick={handleMapClick}
                    mapboxApiAccessToken={mapboxgl.accessToken}
                >
                    <GeolocateControl position="top-left" />
                    <NavigationControl position="top-left" />
                    <FullscreenControl position="top-left" />

                    <Marker latitude={viewport.latitude} longitude={viewport.longitude}>
                        <div style={{ color: "red", fontSize: "24px" }}>📍</div>
                    </Marker>
                </ReactMapGl>
            </div>
        </div>
    );
};

export default CreateNewPlace;
