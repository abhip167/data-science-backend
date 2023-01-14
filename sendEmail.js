// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(
  process.env.SENDGRID_PUBLIC_KEY
);

const sendAnEmail = ({ email, name, phone, natureOfWork, description }) => {
  const msg = {
    to: "abhishekpatel167@gmail.com;abhishekpatelomg@gmail.com", // Change to your recipient
    from: "abhishekmayurbhaipat@cmail.carleton.ca", // Change to your verified sender
    subject: "Action required: Send a document request",
    text: "Hello, please send a document request to below details",
    html: `
            <p>Hello,
              Please send a document request to below organization/individual.
            </p>
            <h3>Details of the data donor</h3>
          <ul>
              <li><b>Email</b> : ${email}</li>
              <br>
              <li><b>Phone</b> : ${phone}</li>
              <br>
              <li><b>Nature of work</b> : ${natureOfWork}</li>
              <br>
              <li><b>Description</b> : ${description}</li>
          </ul>
        `,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.log(error);
    });
};

export { sendAnEmail };
