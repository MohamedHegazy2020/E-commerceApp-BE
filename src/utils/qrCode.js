import qrCode from "qrcode";

export const qrcodeFunction = ({ data = "" } = {}) => {
	const qrCodeResult = qrCode.toDataURL(JSON.stringify(data), {
        		errorCorrectionLevel: "H",
	});
	return qrCodeResult;
};
