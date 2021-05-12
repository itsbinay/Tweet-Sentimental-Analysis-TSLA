import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import moment from 'moment';

am4core.useTheme(am4themes_animated);

function StockLineChart(props) {
  const chart = useRef(null);

  useLayoutEffect(() => {
    const lineChartData = props.lineChartData;
    let x = am4core.create('chartdiv', am4charts.XYChart);

    x.paddingRight = 20;

    let data = [];
    let previousValue;

    // let todayLength = lineChartData.length - 78*4
    let whichday = 0
    let color = null
    for (var i = 0; i < lineChartData.length; i++) {
      
      if(whichday<4){ // first 4 days
        let isIncrease = lineChartData[whichday*78].Open < lineChartData[(whichday+1)*78].Open
        if(isIncrease){
          color = am4core.color('green');
        }else{
          color = am4core.color('red');
        }
      }
      else{
        let isIncrease = lineChartData[whichday*78].Open < lineChartData[lineChartData.length-1].Open
        if(isIncrease){
          color = am4core.color('green');
        }else{
          color = am4core.color('red');
        }
      }
      if(i%78==0 && i!=0){
        whichday+=1;
      }

      var t = new Date(lineChartData[i].time * 1000);

      data.push({
        date: new Date(
          t.getFullYear(),
          t.getMonth(),
          t.getDate(),
          t.getHours(),
          t.getMinutes()
        ),
        value: lineChartData[i].Open,
        color: color
      });
      previousValue = lineChartData[i].Open;


    }

    x.data = data;

    let dateAxis = x.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.skipEmptyPeriods = true;

    let valueAxis = x.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    let series = x.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'value';
    series.tooltipText = 'value: {valueY}, day change: {valueY.previousChange}';
    series.strokeWidth = 2;
    series.propertyFields.stroke = 'color';

    x.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    x.scrollbarX = scrollbarX;

    chart.current = x;

    return () => {
      x.dispose();
    };
  }, []);

  useLayoutEffect(() => {
    chart.current.paddingRight = props.paddingRight;
  }, [props.paddingRight]);

  return <div id="chartdiv" style={{ width: '100%', height: '500px' }}></div>;
}
export default StockLineChart;
