import 'dotenv/config';
import sGmail from '@sendgrid/mail';

const appUrl = process.env.APP_URL_FRONTEND;
const senderEmail = process.env.EMAIL_SENDER;
const Logo = process.env.COT_LOGO_URL;

export const resetAccountUrl = async (token, email, lastName) => {
	const resetLink = `${appUrl}/auth/set-new-password/${token}`;

	const resetMessage = {
		to: email,
		from: senderEmail,
		Subject: 'Reset Account Password',
		text: `Chamber Of Tourism`,
		html: `<div style="background-color: #f9a758; padding: 30px; width: 80%; margin-left: 8%;">
                <img src=${Logo} width="100px" height="75px" alt="logo"/>
                <div style="background-color: white; border-radius: 10px;">
                    <p style="font-size: 18px; padding: 30px;"> 
                        Hi <b>${
													lastName || ''
												} ,</b> here's how to reset your password account.<br />
                        We have recieved a request to have your account reset for <b>Chamber Of Tourism</b>.
                        <br /> 
                        To reset your account, click on the link below:
                        <br />
                        <br />
                        <a
                            href='${resetLink}'
                            style="color:#d23d77; text-decoration:underline"
                            target='_blank'
                        >
                        Reset your Account
                        </a>
                        <br><br>
                        Need help? Ask our Call center <b>8181</b>  or contact helpdesk@cot.org.rw
                        <br><br><br>
                        Best regards, 
                        <br>
                        Chamber Of Tourism
                        <br>
                        <a
                            href='https://cot.org.rw/'
                            style="color:#18a0fb; text-decoration:none"
                            target='_blank'
                        > 
                        Chamber Of Tourism
                        </a>
                    </p>
                </div>
            </div>
        `,
	};
	sGmail.setApiKey(process.env.SENDGRID_API_KEY_COT);
	await sGmail.send(resetMessage);
};

export const sendForgotPasswordUrl = async (token, email) => {
	const forgotPasswordLink = `${appUrl}/auth/password/new/${token}`;

	const forgotPasswordMessage = {
		to: email,
		from: senderEmail,
		Subject: 'Reset Password',
		text: `Chamber Of Tourism`,
		html: `<div style="background-color: #f9a758; padding: 30px; width: 80%; margin-left: 8%;">
                <img src=${Logo} width="100px" height="75px" alt="logo"/>
                <div style="background-color: white; border-radius: 10px;">
                    <p style="font-size: 18px; padding: 30px;"> 
                        Hi <b>${
													email || ''
												} ,</b> here's how to reset your password.<br />
                        We have recieved a request to have your password reset for <b>Chamber Of Tourism</b>.
                        <br /> <br />
                        If you did not make this request, then you can just ignore this email.
                        <br /> 
                        To reset your password, click on the link below:
                        <br />
                        <br />
                        <a
                            href='${forgotPasswordLink}'
                            style="color:#d23d77; text-decoration:underline"
                            target='_blank'
                        >
                        Reset your password
                        </a>
                        <br><br>
                        Need help? Ask our Call center <b>8181</b>  or contact helpdesk@cot.org.rw
                        <br><br><br>
                        Best regards, 
                        <br>
                        Chamber Of Tourism
                        <br>
                        <a
                            href='https://cot.org.rw/'
                            style="color:#18a0fb; text-decoration:none"
                            target='_blank'
                        > 
                        Chamber Of Tourism
                        </a>
                    </p>
                </div>
            </div>
        `,
	};
	sGmail.setApiKey(process.env.SENDGRID_API_KEY_COT);
	await sGmail.send(forgotPasswordMessage);
};

export const memberAccountConfirmUrl = async (
	token,
	email,
	firstName,
	lastName
) => {
	const resetLink = `${appUrl}/auth/member/confirm-member/${token}`;

	const memberMessage = {
		to: email,
		from: senderEmail,
		Subject: 'Member Confirmation',
		text: `Chamber Of Tourism`,
		html: `<div style="background-color: #f9a758; padding: 30px; width: 80%; margin-left: 8%;">
                <img src=${Logo} width="100px" height="75px" alt="logo"/>
                <div style="background-color: white; border-radius: 10px;">
                    <p style="font-size: 18px; padding: 30px;"> 
                        Hi <b>${
													lastName + ' ' + firstName
												} ,</b> here's how to complete your member registration.<br />
                        We have recieved a request to complete your member registration for <b>Chamber Of Tourism</b>.
                        <br /> 
                        To complete your registration, click on the link below:
                        <br />
                        <br />
                        <a
                            href='${resetLink}'
                            style="color:#d23d77; text-decoration:underline"
                            target='_blank'
                        >
                        Complete your registration
                        </a>
                        <br><br>
                        Need help? Ask our Call center <b>8181</b>  or contact helpdesk@cot.org.rw
                        <br><br><br>
                        Best regards, 
                        <br>
                        Chamber Of Tourism
                        <br>
                        <a
                            href='https://cot.org.rw/'
                            style="color:#18a0fb; text-decoration:none"
                            target='_blank'
                        > 
                        Chamber Of Tourism
                        </a>
                    </p>
                </div>
            </div>
        `,
	};
	sGmail.setApiKey(process.env.SENDGRID_API_KEY_COT);
	await sGmail.send(memberMessage);
};

export const membershipApprovalEmail = async (
	email,
	firstName,
	lastName,
	sms
) => {
	const resetLink = `${appUrl}/payments/${email}`;
	const memberMessage = {
		to: email,
		from: senderEmail,
		Subject: 'Membership Confirmation',
		text: `Chamber Of Tourism`,
		html: `<div style="background-color: #fff; padding: 30px; width: 80%; margin-left: 8%;">
                <img src=${Logo} width="100px" height="75px" alt="logo"/>
                <div style="background-color: white; border-radius: 10px;">
                    <p style="font-size: 18px; padding: 30px;"> 
                        Dear <b>${
													lastName + ' ' + firstName
												}</b> ,<br><br> ${sms}
                        <br> <br>
                        <a
                            href='${resetLink}'
                            style="color:#f44336; font-size: 18px; text-decoration:none"
                            target='_blank'
                        > 
                        Continue to the payment process
                        </a>
                        <br> <br>
                        
                        Need help? Ask our Call center <b>8181</b>  or contact helpdesk@cot.org.rw
                        <br><br>
                        Best regards, 
                        <br>
                        Chamber Of Tourism
                        <br>
                        <a
                            href='https://cot.org.rw/'
                            style="color:#18a0fb; text-decoration:none"
                            target='_blank'
                        > 
                        Chamber Of Tourism
                        </a>
                    </p>
                </div>
            </div>
        `,
	};
	sGmail.setApiKey(process.env.SENDGRID_API_KEY_COT);
	await sGmail.send(memberMessage);
};
