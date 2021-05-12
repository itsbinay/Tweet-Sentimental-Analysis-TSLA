import pymysql
import json
import datetime as dt

print('Loading function')

rds_host  = "******.us-east-1.rds.amazonaws.com"
name = "******"
password = "******"
db_name = "Sentiment"

def retrieve_rdms():
    conn = pymysql.connect(
        host=rds_host,
        user=name,
        password=password,
        db=db_name)
    # sql = "SELECT date, postive_count, negative_count, net_count"
    sql =  "Select `tweet_date`,`predict`,count(*) as count from Sentiment.Sentiment where `tweet_date`=%s group by `predict`"
    try:
        with conn.cursor() as cur1:

            day = dt.datetime.now() - dt.timedelta(days=1)
            
            positivearr = []
            negativearr = []
            netarr = []

            for i in range(5):
                
                while True: # while loop to detect 

                    isWeekday = day.weekday() in [i for i in range(5)]
                    if isWeekday:
                        dateformatted = str(day.year)+'-'+str(day.month)+'-'+str(day.day)
                        print("dateformatted:",dateformatted)
                        cur1.execute(sql,(dateformatted))
                        rows = cur1.fetchall()
                        print("Rows:",rows)
                        negative = 0
                        positive = 0
                        for i in range(len(rows)):
                            if i==0:
                                negative = rows[0][2]
                            elif i==1:
                                positive = rows[1][2]

                        net = positive - negative

                        positivearr.append({'date':dateformatted,'value':positive})
                        negativearr.append({'date':dateformatted,'value':negative})
                        netarr.append({'date':dateformatted,'value':net})

                        day = day - dt.timedelta(days=1)
                        break
                        
                    day = day - dt.timedelta(days=1)

    finally:
        conn.close()

    data = [positivearr, negativearr, netarr]

    return json.dumps(data)


def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': "Error" if err else res,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
    }


def lambda_handler(event, context):
    operation = event['httpMethod']
    print("Operation:",operation)
    if operation=="POST":
        responseData = retrieve_rdms()
        return respond(None, responseData)
    else:
        return respond(ValueError('Unsupported method "{}"'.format(operation)))
