
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.TableName;

const getTodo = async (event: any) => {
    const id = event.pathParameters.id;
    try {
        const command = new GetCommand({
            TableName: tableName,
            Key: {
                'id': id
            }
        });

        const response = await docClient.send(command);
        console.log(response);
        console.log(response.data);
        console.log(response.Item);
        
        
        if (response.Item) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token'
                },
                body: JSON.stringify(response.Item),
            };
        }
    } catch (error: any) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token'
            },
            body: JSON.stringify(error.message),
        };
    }
};

module.exports = { getTodo };
