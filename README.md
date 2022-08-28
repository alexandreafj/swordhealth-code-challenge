# swordhealth-code-challenge
## Initialize the application
The command bellow will start the aplication, create the database and tables.
```
docker-compose up
```

## API Documentation
After docker finishes initialize the services you can reach this link [Swagger](http://localhost:8080/api/v1/docs/) to see the endpoints documentation.

## Running local unit tests
Reach by terminal the backend-swordhealth folder and execute:
```
npm run test:unit
```
## How to test it
Create a technician and manager user after the api initialize.
```
curl --request POST \
  --url http://localhost:8080/api/v1/user \
  --header 'Content-Type: application/json' \
  --data '{
	"email": "teste01@teste.com",
	"name": "teste",
	"password": "123456",
	"role": "technician"
}'
```
Get a token to be able to create,update,delete and get tasks.
```
curl --request GET \
  --url 'http://localhost:8080/api/v1/login?email=teste01%40teste.com&password=123456'
```