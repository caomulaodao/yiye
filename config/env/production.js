'use strict';

module.exports = {
  db: 'mongodb://localhost/mean-prod',
  app: {
    name: 'MEAN - A Modern Stack - Production'
  },
  facebook: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  twitter: {
    clientID: 'CONSUMER_KEY',
    clientSecret: 'CONSUMER_SECRET',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
  },
  github: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  google: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  linkedin: {
    clientID: 'API_KEY',
    clientSecret: 'SECRET_KEY',
    callbackURL: 'http://localhost:3000/auth/linkedin/callback'
  },
  emailFrom: '一叶书签  <noreply@yiye.me>', // sender address like ABC <abc@example.com>
  mailer: {
    host:'smtp.exmail.qq.com',
    secureConnection: true,
    port:465,
    auth: {
        user: 'your email',
        pass: 'your pass'
    }
  }
};
