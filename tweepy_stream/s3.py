# -*- coding: utf-8 -*-
"""
Created on Sun May  9 15:32:32 2021

@author: Kashish Jagtiani
"""

import boto3
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import json
import time
from datetime import date
import uuid

s3 = boto3.client('s3')
#s3.put_object(Body = "Test Data", Bucket = "twitter-stream-cloud", Key="test.txt")

#with open('keys.txt', 'r') as f:
    #keys = list(map(lambda x: x.split(' = ')[1], f.readlines()))
    #ckey = str(keys[0])
    #csecret = str(keys[1])
    #atoken = str(keys[2])
    #asecret = str(keys[3])

#print(ckey)
#print(csecret)
#print(atoken)
#print(asecret)
ckey= '*******'
csecret= '*******'
atoken= '*******'
asecret= '*******'

class listen(StreamListener):
    def on_data(self,data):
        req_data = json.loads(data)
        user_name = req_data['user']['screen_name']
        tweet_id = req_data['id']
        data = req_data['text']
        tweet_date = req_data['created_at']
        val = {
            'user_name': user_name,
            'tweet_id': tweet_id,
            'data': data,
            'tweet_date': tweet_date
        }
        today = date.today()
        today = today.strftime("%Y/%m/%d")
        u_id = uuid.uuid1()
        key = today+'/'+str(u_id)+'_'+user_name+'.json'
        s3.put_object(
            Body = str(val),
            Bucket = 'twitter-stream-cloud',
            Key = key
        )
        #print(val)
        return True
        
    def on_error(self,status):
        print(status)
        return True
while True:
    try:
        time.sleep(5)
        auth = OAuthHandler(ckey, csecret)
        auth.set_access_token(atoken, asecret)

        twitter_stream = Stream(auth, listen())

        tags = ['#TSLA', '#Tesla']

        twitter_stream.filter(track = tags)
    except Exception as e:
        time.sleep(5)
        continue

            