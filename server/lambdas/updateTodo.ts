

// const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
// const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

// const client = new DynamoDBClient({});
// const docClient = DynamoDBDocumentClient.from(client);
// const tableName = process.env.TableName;

// const updateTodo = async (event:any) => {
//     if (!event.pathParameters || !event.pathParameters.id || !event.body) {
//         return {
//             statusCode: 500,
//             headers: {
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//                 'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token'
//             },
//             body: 'id not found'
//         };
//     }

//     const id = event.pathParameters.id;
//     const updatedTodo = JSON.parse(event.body);

//     const command = new UpdateCommand({
//         TableName: tableName,
//         Key: { id },
//         UpdateExpression: 'set #title=:title, #completed=:completed',
//         ExpressionAttributeNames: {
//             '#title': 'title',
//             '#completed': 'completed'
//         },
//         ExpressionAttributeValues: {
//             ':title': updatedTodo.title,
//             ':completed': updatedTodo.completed,
//         },
//         ReturnValues: 'ALL_NEW',
//     });

//     try {
//         const response = await docClient.send(command);
//         return {
//             statusCode: 200,
//             headers: {
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//                 'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token'
//             },
//             body: JSON.stringify(response.Item)
//         };
//     } catch (error: any) {
//         console.log(error);
        
//         return {
//             statusCode: 500,
//             headers: {
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//                 'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token'
//             },
//             body: JSON.stringify(error.message)
//         };
//     }
// };

// module.exports = { updateTodo };

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.TableName;

const updateTodo = async (event:any) => {
    if (!event.pathParameters || !event.pathParameters.id || !event.body) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token'
            },
            body: 'id not found'
        };
    }

    const id = event.pathParameters.id;
    const updatedTodo = JSON.parse(event.body);

    // Ensure text and isCompleted are defined
    const text = updatedTodo.text !== undefined ? updatedTodo.text : '';
    const isCompleted = updatedTodo.isCompleted !== undefined ? updatedTodo.isCompleted : false;

    const params = {
        TableName: tableName,
        Key: { id },
        UpdateExpression: 'set #text = :text, #isCompleted = :isCompleted',
        ExpressionAttributeNames: {
            '#text': 'text',
            '#isCompleted': 'isCompleted'
        },
        ExpressionAttributeValues: {
            ':text': text,
            ':isCompleted': isCompleted,
        },
        ReturnValues: 'ALL_NEW',
    };

    try {
        const command = new UpdateCommand(params);
        const response = await docClient.send(command);
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token'
            },
            body: JSON.stringify(response.Attributes)
        };
    } catch (error) {
        console.error('Error updating todo:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token'
            },
            body: JSON.stringify({ error: 'Could not update todo' })
        };
    }
};

module.exports = { updateTodo };
