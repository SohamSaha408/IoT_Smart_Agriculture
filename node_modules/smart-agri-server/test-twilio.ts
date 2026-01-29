import dotenv from 'dotenv';
import twilio from 'twilio';

// Load environment variables
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

// Default test number (the one in the previous file looked like a personal number, use it if available or ask user)
// Using a placeholder or the same from number to verify at least the client init.
// Ideally usage: ts-node test-twilio.ts <to_phone_number>

console.log('--- Twilio Configuration Check ---');
console.log(`Account SID: ${accountSid ? (accountSid.substring(0, 4) + '...') : 'MISSING'}`);
console.log(`Auth Token: ${authToken ? 'PROVIDED' : 'MISSING'}`);
console.log(`From Phone: ${fromPhone}`);

if (!accountSid || !authToken || !fromPhone) {
    console.error('ERROR: Missing Twilio configuration in .env');
    process.exit(1);
}

const client = twilio(accountSid, authToken);

const toPhone = process.argv[2];

if (!toPhone) {
    console.log('\nUsage: npx ts-node test-twilio.ts <recipient_phone_number>');
    console.log('Example: npx ts-node test-twilio.ts +919876543210');
    process.exit(0);
}

console.log(`\nAttempting to send SMS to ${toPhone}...`);

client.messages
    .create({
        body: 'Test message from Smart Agri IoT',
        from: fromPhone,
        to: toPhone
    })
    .then((message) => {
        console.log('SUCCESS: Message sent!');
        console.log(`SID: ${message.sid}`);
        console.log(`Status: ${message.status}`);
    })
    .catch((error) => {
        console.error('FAILURE: Failed to send message.');
        console.error('Error Code:', error.code);
        console.error('Message:', error.message);
        console.error('More Info:', error.moreInfo);
    });
