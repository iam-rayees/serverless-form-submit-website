import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "UserDetails";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

export const handler = async (event) => {
  try {
    // 🔹 Safety check: body must exist
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Request body is missing" }),
      };
    }

    // 🔹 Parse request body safely
    const data =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    // 🔹 Basic validation
    const requiredFields = [
      "name",
      "age",
      "phoneNumber",
      "address",
      "pincode",
      "occupation",
      "annualIncome",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: `Missing field: ${field}` }),
        };
      }
    }

    // 🔹 Prepare DynamoDB item
    const item = {
      id: randomUUID(),
      name: data.name,
      age: Number(data.age),
      phoneNumber: data.phoneNumber,
      address: data.address,
      pincode: data.pincode,
      occupation: data.occupation,
      annualIncome: Number(data.annualIncome),
      createdAt: new Date().toISOString(),
    };

    // 🔹 Save to DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Details submitted successfully",
        id: item.id,
      }),
    };
  } catch (error) {
    console.error("Lambda Error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
    };
  }
};
