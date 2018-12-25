# Produktivv.com Full Stack Project

### Currently being hosted on Digital Ocean at https://www.produktivv.com

API for the PeepX Mobile App

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* [Docker](https://www.docker.com/)

## Installing

## For Development

In outhaflow && server folders. Create dev.js inside config folder. I.E server > config > dev.js

Create the following file structure

module.exports = {
	mongoURI:'mongodb://username:password@ds247191.mlab.com:47191/justdelete2',
	facebookClientId : 'FACEBOOK_CLIENT_ID',
	facebookSecretId : 'FACEBOOK_ID',
	facebookCallBackUrl: 'https://localhost/auth/facebook/callback',
	googleClientID: 'some-key.apps.googleusercontent.com',
	googleClientSecret: 'SOMEAPIKEY',
	hostURL: 'https://localhost'
};


## For production....

Create the following .txt files in secrets folder. You will need FB oauth token, google oauth token.

fb_callback_url.txt
fb_client_id.txt
fb_secret_id.txt
google_client_id.txt
google_client_secret.txt
mongo_uri.txt

* Examples
```
fb_callback_url=https://localhost/auth/facebook/callback
fb_client_id=273898299894334
fb_secret_id=f19f2c37e3cf72222f7fea922148d5e
mongo_uri=mongodb://username:password@ds247191.mlab.com:47222/justdelete2
```

* Then run `docker-compose up` in terminal.
