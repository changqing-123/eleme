import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Space,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import './DeliverForm.less';
import DynamicStartPrice from './DynamicStartPrice';

export default function DeliverForm() {
  const [form] = Form.useForm();
  const [startPrice, setStartPrice] = useState<number>(0);
  const [dynamicStartPriceData, setDynamicStartPriceData] = useState<any>();
  const [periodType, setPeriodType] = useState<number>(0);
  const [deliveryWeightType, setDeliveryWeightType] = useState<number>(1);

  // 起送价增加
  const increasePrice = () => setStartPrice((preVal) => Number(preVal) + 1);

  // 起送价减少
  const decreasePrice = () => {
    setStartPrice((preVal) => {
      if (preVal === 0) return 0;
      return Number(preVal) - 1;
    });
  };

  const onFinish = () => {
    const finishVal = { ...form.getFieldsValue(), dynamicStartPriceData };
    console.log('finishVal', finishVal);
  };

  useEffect(() => {
    form.setFieldValue('startPrice', startPrice);
  }, [startPrice]);

  return (
    <div className="form-box">
      <Form form={form}>
        <Row>
          <Col span={24}>
            <Form.Item
              label={'范围名称'}
              labelCol={{ span: 5 }}
              name={'rangeName'}
            >
              <Input className="input-area" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item
              label={'配送面积'}
              labelCol={{ span: 5 }}
              name={'deliverArea'}
              initialValue={'4871106.57'}
            >
              <span>4871106.57km&sup2;</span>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item
              label={'起送价'}
              labelCol={{ span: 5 }}
              name={'startPrice'}
            >
              <Space className="input-area start-price">
                <div className="input-number-opt" onClick={decreasePrice}>
                  -
                </div>
                <Input
                  className="input-start-price"
                  value={startPrice}
                  addonAfter={'元'}
                />
                <div className="input-number-opt" onClick={increasePrice}>
                  +
                </div>
              </Space>
            </Form.Item>
          </Col>
        </Row>

        {/* 动态起送价 */}
        <DynamicStartPrice
          dynamicStartPriceData={dynamicStartPriceData}
          setDynamicStartPriceData={setDynamicStartPriceData}
          startPrice={startPrice}
        />
        <Form.Item
          label={'配送费'}
          labelCol={{ span: 5 }}
          name={'deliveryMoney'}
        >
          <InputNumber className="input-area" addonAfter={'元'} precision={1} />
        </Form.Item>

        <Form.Item
          label={'生效时段'}
          name={['effectivePeriod', 'periodType']}
          initialValue={0}
        >
          <Radio.Group
            onChange={(e) => {
              setPeriodType(e.target.value);
              form.setFieldValue(
                ['effectivePeriod', 'periodType'],
                e.target.value,
              );
            }}
            value={periodType}
            defaultValue={0}
          >
            <Radio value={1}>同营业时间</Radio>
            <Radio value={0}>自定义</Radio>
          </Radio.Group>
        </Form.Item>

        {periodType === 0 && (
          <Form.List name={['effectivePeriod', 'periodList']}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item {...restField} name={[name, 'first']}>
                      <DatePicker.TimePicker format={'hh:mm'} />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'last']}>
                      <DatePicker.TimePicker format={'hh:mm'} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <div>
                  <Button
                    type="link"
                    onClick={() => {
                      const curList = form.getFieldValue([
                        'effectivePeriod',
                        'periodList',
                      ]);
                      if (!curList || curList.length < 3) {
                        add();
                      } else {
                        message.error('最多添加3个不同时段！');
                      }
                    }}
                    icon={<PlusCircleOutlined />}
                  >
                    添加时段<span className="tip">最多添加3个不同时段</span>
                  </Button>
                </div>
              </>
            )}
          </Form.List>
        )}
        <Form.Item
          label={'配送重量'}
          labelCol={{ span: 5 }}
          name={['deliveryWeight', 'type']}
          initialValue={1}
        >
          <Radio.Group
            defaultValue={0}
            value={deliveryWeightType}
            onChange={(e) => {
              setDeliveryWeightType(e.target.value);
              form.setFieldValue(['deliveryWeight', 'type'], e.target.value);
            }}
          >
            <Radio value={0}>不限</Radio>
            <Radio value={1}>最大</Radio>
          </Radio.Group>
        </Form.Item>
        {deliveryWeightType === 1 && (
          <Form.Item
            name={['deliveryWeight', 'num']}
            rules={[
              {
                validator(rule, value) {
                  if (value < 0) return Promise.reject('请填写正数');
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber className="input-area" addonAfter={'千克'} />
          </Form.Item>
        )}
      </Form>
      <Space className="submit-area">
        <Button>取消</Button>
        <Button type="primary" onClick={() => onFinish()}>
          保存
        </Button>
      </Space>
    </div>
  );
}
