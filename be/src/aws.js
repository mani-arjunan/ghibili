import AWS from 'aws-sdk'

AWS.config.update({ region: 'ap-south-1' });

const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

export const sendOTP = async (phoneNumber, otp) => {
  const params = {
    Message: `Your verification code is ${otp}`,
    PhoneNumber: phoneNumber,
  };

  const data = await sns.publish(params).promise();
  return data;
}
