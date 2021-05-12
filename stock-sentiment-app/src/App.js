import './App.css';
import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import StockLineChart from './components/StockLineChart';
import Axios from 'axios';
import SentimentBarChartPositive from './components/SentimentBarChartPositive';
import SentimentBarChartNegative from './components/SentimentBarChartNegative';
import SentimentBarChartNet from './components/SentimentBarChartNet';

function App() {
  const config = {
    method: 'post',
    url:
      'https://****.execute-api.us-east-1.amazonaws.com/default/yahoofinance',
    headers: {
      'X-Amz-Date': '*******',
      Authorization:
        '***********',
    },
  };

  const [lineChartData, setLineChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);

  useEffect(() => {
    console.log('Useeffect');
    Axios(config)
    .then(function (response) {
      console.log("metrics")
      setLineChartData(response.data.metrics);
    })
    .catch(function (error) {
      console.log(error);
    });

    Axios.post(
      'https://*******.execute-api.us-east-1.amazonaws.com/default/SentimentDataApi'
    )
      .then(function (response) {
        console.log('bar', response);
        setBarChartData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    setInterval(()=>{
      Axios(config)
      .then(function (response) {
        console.log("metrics")
        setLineChartData(response.data.metrics);
      })
      .catch(function (error) {
        console.log(error);
      });
      Axios.post(
        'https://*********.execute-api.us-east-1.amazonaws.com/default/SentimentDataApi'
      )
        .then(function (response) {
          console.log('bar', response);
          setBarChartData(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },300000)
    
    
  }, []);

  return (
    <div>
      <Typography variant="h1" component="h2" gutterBottom>
        Stock Price Sentiment Analysis
      </Typography>
      <Typography variant="h3" gutterBottom>
        Tesla Stock Price taken from YahooFinance
      </Typography>
      {lineChartData ? <StockLineChart lineChartData={lineChartData} /> : null}
      <div style={{padding:10}}/>
      <Typography variant="h3" gutterBottom>
        Net Tweet Sentiment Predictions
      </Typography>
      {barChartData ? (
        <SentimentBarChartNet barChartData={barChartData} />
      ) : null}
      <div style={{padding:10}}/>
      <Typography variant="h3" gutterBottom>
        Positive Tweet Sentiment Predictions
      </Typography>
      <div style={{padding:10}}/>
      {barChartData ? (
        <SentimentBarChartPositive barChartData={barChartData} />
      ) : null}
      <div style={{padding:10}}/>
      <Typography variant="h3" gutterBottom>
        Negative Tweet Sentiment Predictions
      </Typography>
      {barChartData ? (
        <SentimentBarChartNegative barChartData={barChartData} />
      ) : null}
      
    </div>
  );
}

export default App;
