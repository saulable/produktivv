# Produktivv.com Full Stack Project

### Currently being hosted on Digital Ocean at https://www.produktivv.com

API for the PeepX Mobile App

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* [Docker](https://www.docker.com/)

## Installing

Create the following .txt files in secrets folder. You will need FB oauth token, google oauth token.

fb_callback_url.txt
fb_client_id.txt
fb_secret_id.txt
google_client_id.txt
google_client_secret.txt
mongo_uri.txt

* Examples

* Copy the .env.example file to a new .env file and fill in the variables like so, you can find them in the resources channel in slack

```
fb_callback_url=https://localhost/auth/facebook/callback
fb_client_id=273898299894334
fb_secret_id=f19f2c37e3cf72222f7fea922148d5e
mongo_uri=mongodb://username:password@ds247191.mlab.com:47222/justdelete2
```

* Then run `docker-compose up` in terminal.
