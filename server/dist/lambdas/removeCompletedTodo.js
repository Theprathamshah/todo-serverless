"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCompletedTodo = void 0;
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.TableName || '';
const removeCompletedTodo = async (event) => {
    try {
        const scanCommand = new ScanCommand({
            TableName: tableName,
            FilterExpression: 'isCompleted = :isCompleted',
            ExpressionAttributeValues: { ':isCompleted': true }
        });
        const scanResult = await docClient.send(scanCommand);
        const scannedItems = scanResult.Items;
        if (scannedItems.length === 0) {
            console.log('No completed todos found to delete!!');
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token'
                },
                body: JSON.stringify({ message: 'No completed todos to delete' }),
            };
        }
        const deleteRequests = scannedItems.map((item) => ({
            DeleteRequest: {
                Key: { id: item.id },
            }
        }));
        const batchWriteParams = {
            RequestItems: {
                [tableName]: deleteRequests,
            }
        };
        const batchWriteCommand = new BatchWriteCommand(batchWriteParams);
        await docClient.send(batchWriteCommand);
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token'
            },
            body: JSON.stringify({ message: `Deleted this todos ${scannedItems} successfully` })
        };
    }
    catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token'
            },
            body: JSON.stringify({ error })
        };
    }
};
exports.removeCompletedTodo = removeCompletedTodo;
