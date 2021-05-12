import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

function SentimentBarChartPositive(props) {
  const barChartData = props.barChartData;

  let chart = am4core.create('barchartdivpositive', am4charts.XYChart);

  let data = [];

  for (var i = 0; i < barChartData[0].length; i++) {
    var t = new Date(barChartData[0][i].date);
    var value = barChartData[0][i].value;
    data.push({
      date: new Date(t.getFullYear(), t.getMonth(), t.getDate()),
      value: value,
    });
  }

  console.log(data);
  chart.data = data;
  // Create axes
  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.grid.template.location = 0.5;
  dateAxis.renderer.labels.template.location = 0.5;
  dateAxis.skipEmptyPeriods = true;

  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.min = 0;

  // Create series
  var series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueY = 'value';
  series.dataFields.dateX = 'date';
  series.name = 'Sales';
  series.columns.template.adapter.add('fill', function (fill, target) {
    return (chart.colors = am4core.color('#2E8B57'));
  });

  let bullet = series.bullets.push(new am4charts.LabelBullet());
  bullet.interactionsEnabled = false;
  bullet.dy = 30;
  bullet.label.text = '{value}';
  bullet.label.fill = am4core.color('#ffffff');

  // Create scrollbars
  chart.scrollbarX = new am4core.Scrollbar();
  chart.scrollbarY = new am4core.Scrollbar();

  useLayoutEffect(() => {
    chart.dispose();
  }, []);

  return (
    <div
      id="barchartdivpositive"
      style={{ width: '100%', height: '500px' }}
    ></div>
  );
}
export default SentimentBarChartPositive;
