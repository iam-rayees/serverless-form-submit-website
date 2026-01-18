import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'UserDetails';

export const handler = async (event) => {

    // Headers for CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
    };

    // Handle Preflight (OPTIONS request)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: headers,
            body: ''
        };
    }

    try {
        let data;
        if (typeof event.body === 'string') {
            data = JSON.parse(event.body);
        } else {
            data = event.body;
        }

        if (!data) {
            return {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({ message: `No body provided` })
            };
        }

        // Basic Validation
        const requiredFields = ['name', 'age', 'phoneNumber', 'address', 'pincode', 'occupation', 'annualIncome'];
        for (const field of requiredFields) {
            if (data[field] === undefined || data[field] === null || data[field] === '') {
                return {
                    statusCode: 400,
                    headers: headers,
                    body: JSON.stringify({ message: `Missing required field: ${field}` })
                };
            }
        }

        // Generate ID
        const id = randomUUID();

        const item = {
            id: id,
            name: data.name,
            age: data.age,
            phoneNumber: data.phoneNumber,
            address: data.address,
            pincode: data.pincode,
            occupation: data.occupation,
            annualIncome: data.annualIncome,
            createdAt: new Date().toISOString()
        };

        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: item
        });

        await docClient.send(command);

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({
                message: 'Details submitted successfully',
                id: id
            })
        };

    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
        };
    }
};
