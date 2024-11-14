import { QuestionCircleOutlined, RightOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import './DynamicStartPrice.less';
import StartPriceModal from './StartPriceModal';

export default function DynamicStartPrice({
  dynamicStartPriceData,
  setDynamicStartPriceData,
  startPrice,
}: any) {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [journeyList, setJourneyList] = useState([]);
  const [periodList, setPeriodList] = useState([]);

  const clickSetting = () => {
    setIsOpenModal(true);
  };

  useEffect(() => {
    setJourneyList(dynamicStartPriceData?.journeyList);
    setPeriodList(dynamicStartPriceData?.periodList);
  }, [dynamicStartPriceData]);

  return (
    <div className="dynamicStartPricebody">
      <div className="title">
        <div className="text">
          动态起送价 <QuestionCircleOutlined />
        </div>
        <div className="setting" onClick={clickSetting}>
          设置
          <RightOutlined />
        </div>
      </div>

      <div className="content">
        <ul className="journey ul">
          {journeyList?.map((item: any) => (
            <li key={JSON.stringify(item)} className="list">
              <div>
                {item.first}
                {item.last ? `-${item.last} km` : ' km 及以上'}
              </div>
              <div>加价{item.price}元</div>
            </li>
          ))}
        </ul>

        {periodList?.length > 0 && (
          <ul className="period ul">
            {periodList?.map((item: any) => (
              <li key={JSON.stringify(item)} className="list">
                <div>
                  {item.timeRange.first}-{item.timeRange.last}
                </div>
                <div>加价{item.price}元</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <StartPriceModal
        open={isOpenModal}
        setOpen={setIsOpenModal}
        setDynamicStartPriceData={setDynamicStartPriceData}
        startPrice={startPrice}
      />
    </div>
  );
}
