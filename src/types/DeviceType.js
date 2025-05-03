
var deviceType = new Map();

deviceType.set("Không khí", { name: "Không khí", profileId: "05b14000-26af-11f0-8e97-eb280e34b0d8", attribute: [
    {field: "temperature", name: "Nhiệt độ"}, 
    {field: "humidity", name: "Độ ẩm"},
    {field: "air_quality", name: "Chất lượng kk"}
] });
deviceType.set("Độ ẩm đất bơm nước", { name: "Độ ẩm, máy bơm" , profileId: "1bf4dd90-26af-11f0-8e97-eb280e34b0d8", attribute: [{field: "soilMoisture", name: "Độ ẩm đất"}] });
deviceType.set("Ánh sáng, lượng mưa", { name: "Ánh sáng, mưa" , profileId: "313d2b30-26af-11f0-8e97-eb280e34b0d8", attribute: [{field: "light", name: "Ánh sáng"}, {field: "rain", name: "Mưa"}] });
deviceType.set("Ổ cắm", { name: "Ổ cắm", attribute: [{field: "status", name: "Trạng thái"}] });
deviceType.set("Công tắc", { name: "Công tắc", attribute: [{field: "status", name: "Trạng thái"}] });
deviceType.set("Bóng đèn", { name: "Bóng đèn", attribute: [{field: "brightness", name: "Độ sáng"}] });
deviceType.set("Cửa thẻ từ", { name: "Thẻ từ", profileId: "2665bf60-26af-11f0-8e97-eb280e34b0d8", attribute: [{field: "RFID", name: "ID thẻ"}, {field: "open", name: "Trạng thái mở"}] });

export default deviceType;