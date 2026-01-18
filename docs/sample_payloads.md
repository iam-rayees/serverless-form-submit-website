# Sample JSON Payloads

## Request Payload (POST /submit)

```json
{
  "name": "John Doe",
  "age": 30,
  "phoneNumber": "1234567890",
  "address": "123 Tech Park, Innovation City",
  "pincode": 560100,
  "occupation": "Cloud Architect",
  "annualIncome": 120000
}
```

## Success Response (200 OK)

```json
{
  "message": "Details submitted successfully",
  "id": "c7b3d8e0-5e0f-4f27-8c5e-8849419c8f1a"
}
```

## Error Response (400 Bad Request)

```json
{
  "message": "Missing required field: occupation"
}
```
