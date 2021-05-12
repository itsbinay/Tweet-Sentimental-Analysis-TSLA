import json
import ast
import urllib.parse
import urllib.request
import boto3
import pymysql.cursors
import logging
import sys
from datetime import datetime
rds_host  = "******.us-east-1.rds.amazonaws.com"
name = "******"
password = "******"
db_name = "Sentiment"
logger = logging.getLogger()
logger.setLevel(logging.INFO)
url = "http://******.compute-1.amazonaws.com:5000/predict"

s3 = boto3.client('s3')

def con(data):
    dtime = data['tweet_date']
    # format twitter date
    new_datetime = datetime.strftime(datetime.strptime(dtime,'%a %b %d %H:%M:%S +0000 %Y'), '%Y-%m-%d %H:%M:%S')
    dtime2 = datetime.fromisoformat(new_datetime)
    timestore = str(dtime2.year)+'-'+str(dtime2.month)+'-'+str(dtime2.day)

    try:
        conn = pymysql.connect(host=rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
    except pymysql.MySQLError as e:
        logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
        logger.error(e)
        sys.exit()

    logger.info("SUCCESS: Connection to RDS MySQL instance succeeded")
    
    sql = "INSERT INTO Sentiment.Sentiment (tweet_id, tweet_date, predict) VALUES (%s, %s, %s)"
    try:
        with conn.cursor() as cur:
            cur.execute(sql, (str(data['tweet_id']), timestore, (data['predict'])))

        conn.commit()
    finally:
        conn.close()
    return "Added items to RDS"

def lambda_handler(event, context):

    data = s3.get_object(Bucket='twitter-stream-cloud', Key=event['Records'][0]['s3']['object']['key'])

    file_content = ast.literal_eval(data['Body'].read().decode("utf-8"))
    tweet = file_content['data'].encode('utf-8')

    req = urllib.request.Request(url, tweet, headers={'Content-type': 'plain/text'})
    the_page =  None
    
    with urllib.request.urlopen(req) as response:
        the_page = response.read().decode("utf-8")

    data_rds = {
        'tweet_id': str(file_content['tweet_id']),
        'tweet_date': file_content['tweet_date'],
        'predict': the_page
    }
    print(con(data_rds))
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }