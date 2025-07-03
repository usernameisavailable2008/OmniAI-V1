import { randomBytes } from 'crypto';

const sessionSecret = randomBytes(32).toString('base64');
console.log('Generated Session Secret:');
console.log(sessionSecret);
console.log('\nAdd this to your .env file as SESSION_SECRET='); 