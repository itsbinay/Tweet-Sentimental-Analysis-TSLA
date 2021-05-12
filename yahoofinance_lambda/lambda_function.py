import boto3
import json
import yfinance as yf

print('Loading function')

def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': "Error" if err else json.dumps(res),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
    }


def lambda_handler(event, context):
    '''Demonstrates a simple HTTP endpoint using API Gateway. You have full
    access to the request and response payload, including headers and
    status code.

    To scan a DynamoDB table, make a GET request with the TableName as a
    query string parameter. To put, update, or delete an item, make a POST,
    PUT, or DELETE request respectively, passing in the payload to the
    DynamoDB API as a JSON body.
    '''
    #print("Received event: " + json.dumps(event, indent=2))

    print("Lambda function called")

    operation = event['httpMethod']
    print("Operation:",operation)
    if operation=="POST":
        print("Detected post")
        data = yf.download("TSLA",period="5d",interval="5m",group_by="ticker",auto_adjust=True)
        print("Finished getting data")
        
        # add code for processing here
        length = 78
        result = []
        extrametrics = []

        for i in range(5):
            tempdata = None
            if i==4:
                tempdata = data[length*i:len(data)]
            else:
                tempdata = data[length*i:length*(i+1)]
            increase = tempdata.Open[0]<tempdata.Close[-1]
            
            
            for j in range(len(tempdata)):
                tempdict = {}
                extra={}
                tempdict['time'] = tempdata.index[j].timestamp()
                
                extra['time'] = tempdata.index[j].timestamp()
                extra['Open'] = tempdata.Open[j]
                extra['Close'] = tempdata.Close[j]
                extra['High'] = tempdata.High[j]
                extra['Low'] = tempdata.Low[j]
                extra['Volume'] = int(tempdata.Volume[j])
                
                if increase:
                    tempdict['increase'] = tempdata.Open[j]
                else:
                    tempdict['decrease'] = tempdata.Open[j]
                
                result.append(tempdict)
                extrametrics.append(extra)
        responseData = {'chart':result,'metrics':extrametrics}
        return respond(None, responseData)
    else:
        return respond(ValueError('Unsupported method "{}"'.format(operation)))
