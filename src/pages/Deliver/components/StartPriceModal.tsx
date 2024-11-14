import {
  DeleteOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Collapse,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  Space,
  message,
} from 'antd';
import moment from 'moment';
import { useState } from 'react';
import './StartPriceModal.less';

interface Iprops {
  open: boolean;
  startPrice: number | string;
  setOpen: (param: boolean) => void;
  setDynamicStartPriceData: (params: any) => void;
}
export default function StartPriceModal({
  open,
  startPrice,
  setOpen,
  setDynamicStartPriceData,
}: Iprops) {
  const [form] = Form.useForm();
  const [showJourneyAddErr, setShowJourneyAddErr] = useState(false);

  const onCancal = () => setOpen(false);

  const onOk = async () => {
    form
      .validateFields()
      .then(() => {
        let finishVal = {
          ...JSON.parse(JSON.stringify(form.getFieldsValue())),
        };
        finishVal.periodList?.forEach((item: any) => {
          item.timeRange.first = moment(item.timeRange.first).format('hh:mm');
          item.timeRange.last = moment(item.timeRange.last).format('hh:mm');
        });
        setDynamicStartPriceData(finishVal);
        setOpen(false);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  return (
    <div>
      <Modal
        width={'940px'}
        title="动态起送价"
        open={open}
        onCancel={onCancal}
        onOk={onOk}
      >
        <div className="start-price-title">起送价{startPrice}元</div>
        <Form form={form}>
          <Collapse defaultActiveKey={['1']}>
            <Collapse.Panel
              header={
                <div>
                  距离动态加价 <QuestionCircleOutlined />
                </div>
              }
              key={'1'}
            >
              <Form.List name="journeyList" initialValue={[{}]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: 'flex', marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          label={'距离'}
                          name={[name, 'first']}
                          rules={[
                            {
                              validator: (rule, value) => {
                                if (Number(value) < 0) {
                                  return Promise.reject(
                                    new Error('请输入正数距离'),
                                  );
                                } else if (isNaN(Number(value))) {
                                  return Promise.reject(
                                    new Error('必须填写数字！'),
                                  );
                                } else {
                                  return Promise.resolve();
                                }
                              },
                            },
                          ]}
                          initialValue={
                            name === 0
                              ? ''
                              : form.getFieldValue([
                                  'journeyList',
                                  name - 1,
                                  'last',
                                ])
                          }
                        >
                          <InputNumber
                            className="input-area"
                            disabled={name !== 0}
                            addonAfter={'km'}
                            precision={1}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label={'至'}
                          name={[name, 'last']}
                          rules={[
                            {
                              validator(rule, value) {
                                const curJourneyVal = form.getFieldValue([
                                  'journeyList',
                                  name,
                                  'first',
                                ]);
                                if (Number(value) < 0) {
                                  return Promise.reject(
                                    new Error('请输入正数距离'),
                                  );
                                } else if (
                                  Number(value) <= Number(curJourneyVal)
                                ) {
                                  return Promise.reject(
                                    new Error('第二段距离不能小于等于第一段！'),
                                  );
                                } else {
                                  return Promise.resolve();
                                }
                              },
                            },
                          ]}
                        >
                          <InputNumber
                            className="input-area"
                            precision={1}
                            placeholder="最远距离"
                            addonAfter={'km'}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label={'加价'}
                          name={[name, 'price']}
                          initialValue={0}
                          rules={[
                            {
                              validator(rule, value) {
                                if (value !== 0 && !value)
                                  return Promise.reject(
                                    new Error('请输入加价'),
                                  );
                                if (value < 0)
                                  return Promise.reject(
                                    new Error('不能为负数'),
                                  );
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <InputNumber
                            className="input-area"
                            precision={1}
                            addonAfter={'元'}
                          />
                        </Form.Item>
                        <DeleteOutlined
                          onClick={() => {
                            remove(name);
                            const curJourneyList =
                              form.getFieldValue('journeyList');
                            if (
                              curJourneyList.length <= 10 &&
                              showJourneyAddErr === true
                            ) {
                              setShowJourneyAddErr(false);
                            }
                          }}
                        />
                      </Space>
                    ))}
                    <div className="add-btn-box">
                      <Button
                        type="link"
                        onClick={() => {
                          const curJourneyList =
                            form.getFieldValue('journeyList');

                          if (
                            curJourneyList &&
                            !curJourneyList[curJourneyList.length - 1].last
                          ) {
                            message.error('请输入完整信息后添加');
                            return;
                          }

                          if (curJourneyList.length >= 10) {
                            message.error('最多10段不同距离');
                            return;
                          }
                          add();
                        }}
                        icon={<PlusCircleOutlined />}
                      >
                        添加
                        <span
                          className="journey-add-error"
                          style={{ color: 'grey' }}
                        >
                          最多10段不同距离
                        </span>
                      </Button>
                    </div>
                  </>
                )}
              </Form.List>
            </Collapse.Panel>
            <Collapse.Panel
              header={
                <div>
                  时段动态加价 <QuestionCircleOutlined />
                </div>
              }
              key={'2'}
            >
              <Form.List name="periodList">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: 'flex', marginBottom: 8 }}
                        align="baseline"
                      >
                        <Space align="baseline">
                          <Form.Item
                            {...restField}
                            label={'时段'}
                            name={[name, 'timeRange', 'first']}
                            rules={[{ required: true }]}
                          >
                            <DatePicker.TimePicker
                              className="input-area"
                              format={'HH:mm'}
                            />
                          </Form.Item>
                          ~
                          <Form.Item
                            {...restField}
                            name={[name, 'timeRange', 'last']}
                            rules={[{ required: true, message: '请输入时间' }]}
                          >
                            <DatePicker.TimePicker
                              className="input-area"
                              format={'HH:mm'}
                            />
                          </Form.Item>
                        </Space>

                        <Form.Item
                          {...restField}
                          label={'加价'}
                          name={[name, 'price']}
                          rules={[{ required: true }]}
                        >
                          <InputNumber precision={1} addonAfter={'元'} />
                        </Form.Item>
                        <DeleteOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <div>
                      <Button
                        type="link"
                        onClick={() => add()}
                        icon={<PlusCircleOutlined />}
                      >
                        添加
                      </Button>
                    </div>
                  </>
                )}
              </Form.List>
            </Collapse.Panel>
          </Collapse>
        </Form>
      </Modal>
    </div>
  );
}
