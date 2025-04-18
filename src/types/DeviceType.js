
var deviceType = new Map();

deviceType.set("AIR", { name: "Không khí", profileId: "d5c2ade0-155e-11f0-a384-51b12a340834", attribute: [
    {field: "temperature", name: "Nhiệt độ"}, 
    {field: "humidity", name: "Độ ẩm"},
    {field: "air_quality", name: "Chất lượng kk"}
] });
deviceType.set("SOIL", { name: "Độ ẩm, máy bơm" , profileId: "14a242a0-155f-11f0-a384-51b12a340834", attribute: [{field: "soilMoisture", name: "Độ ẩm đất"}] });
deviceType.set("LIGHT_RAIN", { name: "Ánh sáng, mưa" , profileId: "04d6fc80-155f-11f0-a384-51b12a340834", attribute: [{field: "light", name: "Ánh sáng"}, {field: "rain", name: "Mưa"}] });
deviceType.set("PLUGIN", { name: "Ổ cắm", attribute: [{field: "status", name: "Trạng thái"}] });
deviceType.set("SWITCH", { name: "Công tắc", attribute: [{field: "status", name: "Trạng thái"}] });
deviceType.set("LIGHT_LED", { name: "Bóng đèn", attribute: [{field: "brightness", name: "Độ sáng"}] });
// deviceType.set("GATEWAY", { name: "Gateway", attribute: [{field: "status", name: "Trạng thái"}] });
deviceType.set("RC522_MODULE", { name: "Thẻ từ", profileId: "f7016be0-155e-11f0-a384-51b12a340834", attribute: [{field: "RFID", name: "ID thẻ"}, {field: "open", name: "Trạng thái mở"}] });

export default deviceType;