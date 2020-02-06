import { GoogleCharts } from 'google-charts';
import data from '../../tmp/02/challenge_yurika_map03_.json';

function drawMap() {
  var dt = GoogleCharts.api.visualization.arrayToDataTable(data);
  var options = {
    region: 'JP', //地域
    displayMode: 'regions', // regions=塗りつぶし, markers=マーカー
    backgroundColor: '#ebf7fe', //背景色
    datalessRegionColor: 'black', // データが無い時の色
    resolution: 'provinces',
    colors: ['white', 'green'], //階層の色,
    legend: {
      textStyle: {
        color: 'black',
        fontSize: 30,
      },
    },
    width: 900,
  };
  //出力するDivを指定して chart を生成
  var chart = new GoogleCharts.api.visualization.GeoChart(document.getElementById('region-div'));
  //描画
  chart.draw(dt, options);
}

GoogleCharts.load(drawMap);
