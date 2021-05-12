import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

function SentimentBarChartNet(props) {
  const barChartData = props.barChartData;

  let chart = am4core.create('barchartdivnet', am4charts.XYChart);

  let data = [];

  var max = 0;

  for (var i = 0; i < barChartData[2].length; i++) {
    var t = new Date(barChartData[2][i].date);
    var value = barChartData[2][i].value;

    if (value > max) max = value;

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

  valueAxis.max = max;

  // Create series
  var series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueY = 'value';
  series.dataFields.dateX = 'date';
  series.name = 'Sales';
  series.columns.template.adapter.add('fill', function (fill, target) {
    return chart.colors.getIndex(target.dataItem.index);
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
    <div id="barchartdivnet" style={{ width: '100%', height: '500px' }}></div>
  );
}
export default SentimentBarChartNet;
