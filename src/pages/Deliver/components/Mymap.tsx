import AMapLoader from '@amap/amap-jsapi-loader';
import { useEffect } from 'react';
import './mymap.less';

export default function Mymap() {
  useEffect(() => {
    AMapLoader.load({
      key: '90efddecc57f003c5ccce9462bda6d25',
      version: '2.0',
      plugins: [],
    })
      .then((AMap) => {
        let amap = new AMap.Map('map-container', {
          zoom: 15,
          center: [116.4074, 39.9042],
        });

        let marker = new AMap.Marker({
          position: [116.4074, 39.9042],
        });

        amap.add(marker);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return <div id="map-container"></div>;
}
