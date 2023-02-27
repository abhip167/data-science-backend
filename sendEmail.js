// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_PUBLIC_KEY);

const sendAnEmail = ({
  recepients,
  email,
  name,
  phone,
  organization,
  natureOfWork,
  description,
}) => {
  const msg = {
    to: recepients, // Change to your recipient
    from: "abhishekmayurbhaipat@cmail.carleton.ca", // Change to your verified sender
    subject: "Action required: Send a document request",
    text: "Hello, please send a document request to below details",
    html: `
            <p>Hello,
              Please send a document request to below organization/individual.
            </p>
            <h3>Details of the data donor</h3>
          <ul>
              <li><b>Name</b> : ${name}</li>
              <br>
              <li><b>Organization</b> : ${organization}</li>
              <br>
              <li><b>Email</b> : ${email}</li>
              <br>
              <li><b>Phone</b> : ${phone}</li>
              <br>
              <li><b>Nature of work</b> : ${natureOfWork}</li>
              <br>
              <li><b>Description</b> : ${description}</li>
          </ul>

          <p>Thank you for your time and effort.</p>
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

const recepientAdditionEmail = ({ first_name, last_name, email }) => {
  const msg = {
    to: email, // Change to your recipient
    from: "abhishekmayurbhaipat@cmail.carleton.ca", // Change to your verified sender
    subject: "Notification: You have been added as a recepient",
    text: "Hello, please send a document request to below details",
    html: `
            <p>Hello,
              You are now been added as a recepient for Carleton Data Science Portal. Every time a user submits a data request, you will be notified.
            </p>
            <h3>Actions</h3>
          <ul>
              <li>Record the user details from the portal admin page</li>
              <br>
              <li>Send a document request to the user</li>
              <br>
        
          </ul>

          <p> In case you want to unsubscribe, please contact the portal admin. Details of the recepient are:</p>
          <ul>
              <li><b>First Name</b> : ${first_name}</li>
              <br>
              <li><b>Last Name</b> : ${last_name}</li>
              <br>
              <li><b>Email</b> : ${email}</li>
          </ul>

          <p>Thank you for your time and effort.</p>
        `,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Recepient addition Email sent");
    })
    .catch((error) => {
      console.log(error);
    });
};

export { sendAnEmail, recepientAdditionEmail };
