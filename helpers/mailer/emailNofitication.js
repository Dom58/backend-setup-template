import 'dotenv/config';
import sGmail from '@sendgrid/mail';

const appUrl = process.env.APP_URL_FRONTEND;
const senderEmail = process.env.EMAIL_SENDER;
const Logo = process.env.COT_LOGO_URL;

export const sendEmailNotification = async (email, message, memberId) => {
	const memberLink = `${appUrl}/accounts/members/${memberId}`;

	const resetMessage = {
		to: email,
		from: senderEmail,
		Subject: 'Notified by chamber of Tourism Rwanda',
		text: `Chamber Of Tourism`,
		html: `<div style="background-color: #f9a758; padding: 30px; width: 80%; margin-left: 8%;">
                <img src=${Logo} width="100px" height="75px" alt="logo"/>
                <div style="background-color: white; border-radius: 10px;">
                    <p style="font-size: 18px; padding: 30px;"> 
                        Hi <b>${
													email || ''
												} ,</b> <br/> There some comments on your membership application to CHAMBER OF TOURISM RWANDA<br />
                        <br />
                        <br />
                        ${message}
                        <br /> 
                        Click on the link below to view more:
                        <br />
                        <a
                            href='${memberLink}'
                            style="color:#d23d77; text-decoration:underline"
                            target='_blank'
                        >
                        View membership application
                        </a>
                        <br><br>
                        Need help? Ask our Call center <b>8181</b>  or contact helpdesk@cot.org.rw
                        <br><br><br>
                        Best regards, 
                        <br>
                        Website:
                        <a
                            href='https://cot.org.rw'
                            style="color:#18a0fb; text-decoration:none"
                            target='_blank'
                        > 
                        Chamber Of Tourism Rwanda
                        </a>
                        <br>
                        Need help? Ask our Call center <b>8181</b>
                    </p>
                </div>
            </div>
        `,
	};
	sGmail.setApiKey(process.env.SENDGRID_API_KEY_COT);
	await sGmail.send(resetMessage);
};
