import nodemailer from "nodemailer";

export async function sendEmailService({
	to,
	subject,
	message, 
	attachments = [],
} = {}) {
	// configurations
	const transporter = nodemailer.createTransport({
		host:'localhost',
                port:465,
                secure:true,
                service:'gmail',
		auth: {
			// credentials
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASSWORD,
		},tls:{rejectUnauthorized:false}
	});

	const emailInfo = await transporter.sendMail({
		from: '"e-commerce 🛒" <${process.env.EMAIL}>',
		to: to ? to : "",
		subject: subject ? subject : "Hello",
		html: message ? message : 'mohamedhegazy219427@gmail.com',
		attachments,
	});
	if (emailInfo.accepted.length) {
		return true;
	}
	return false;
}
