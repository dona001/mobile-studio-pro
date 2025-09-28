import {
  ClearOutlined,
  CodeOutlined,
  CopyOutlined,
  PicRightOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {Button, Card, Form, Input, Modal, Select, Space, Tooltip} from 'antd';
import hljs from 'highlight.js';
import _ from 'lodash';
import {useState} from 'react';

import {BUTTON} from '../../constants/antd-types';
import {CLIENT_FRAMEWORK_MAP} from '../../lib/client-frameworks/map';
import {copyToClipboard} from '../../polyfills';
import InspectorStyles from './Inspector.module.css';

const Recorder = (props) => {
  const {showBoilerplate, recordedActions, clientFramework, saveRecording, isSavingRecording, t} =
    props;
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [form] = Form.useForm();

  const code = (raw = true) => {
    const {serverDetails, sessionCaps} = props;
    const {serverUrl, serverUrlParts} = serverDetails;

    const ClientFrameworkClass = CLIENT_FRAMEWORK_MAP[clientFramework];
    const framework = new ClientFrameworkClass(serverUrl, serverUrlParts, sessionCaps);
    framework.actions = recordedActions;
    const rawCode = framework.getCodeString(showBoilerplate);
    if (raw) {
      return rawCode;
    }
    return hljs.highlight(rawCode, {language: ClientFrameworkClass.highlightLang}).value;
  };

  const handleSaveRecording = async () => {
    try {
      const values = await form.validateFields();
      await saveRecording(values.name, values.description);
      setIsSaveModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Save recording error:', error);
    }
  };

  const actionBar = () => {
    const {setClientFramework, toggleShowBoilerplate, clearRecording} = props;

    return (
      <Space size="middle">
        {!!recordedActions.length && (
          <Space.Compact>
            <Tooltip title={t('Show/Hide Boilerplate Code')}>
              <Button
                onClick={toggleShowBoilerplate}
                icon={<PicRightOutlined />}
                type={showBoilerplate ? BUTTON.PRIMARY : BUTTON.DEFAULT}
              />
            </Tooltip>
            <Tooltip title={t('Copy code to clipboard')}>
              <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(code())} />
            </Tooltip>
            <Tooltip title={t('Save Recording')}>
              <Button
                icon={<SaveOutlined />}
                onClick={() => setIsSaveModalVisible(true)}
                loading={isSavingRecording}
                type={BUTTON.PRIMARY}
              />
            </Tooltip>
            <Tooltip title={t('Clear Actions')}>
              <Button icon={<ClearOutlined />} onClick={clearRecording} />
            </Tooltip>
          </Space.Compact>
        )}
        <Select
          defaultValue={clientFramework}
          value={clientFramework}
          onChange={setClientFramework}
          className={InspectorStyles['framework-dropdown']}
          options={_.map(CLIENT_FRAMEWORK_MAP, (fwClass, fwId) => ({
            value: fwId,
            label: fwClass.readableName,
          }))}
        />
      </Space>
    );
  };

  return (
    <>
      <Card
        title={
          <span>
            <CodeOutlined /> {t('Recorder')}
          </span>
        }
        className={InspectorStyles['interaction-tab-card']}
        extra={actionBar()}
      >
        {!recordedActions.length && (
          <div className={InspectorStyles['no-recorded-actions']}>
            {t('enableRecordingAndPerformActions')}
          </div>
        )}
        {!!recordedActions.length && (
          <pre className={InspectorStyles['recorded-code']}>
            <code dangerouslySetInnerHTML={{__html: code(false)}} />
          </pre>
        )}
      </Card>

      <Modal
        title={t('Save Recording')}
        open={isSaveModalVisible}
        onOk={handleSaveRecording}
        onCancel={() => {
          setIsSaveModalVisible(false);
          form.resetFields();
        }}
        okText={t('Save')}
        cancelText={t('Cancel')}
        confirmLoading={isSavingRecording}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={t('Recording Name')}
            rules={[{required: true, message: t('Please enter a recording name')}]}
          >
            <Input placeholder={t('e.g., Login Flow, Payment Process')} />
          </Form.Item>
          <Form.Item
            name="description"
            label={t('Description')}
            rules={[{required: true, message: t('Please enter a description')}]}
          >
            <Input.TextArea rows={3} placeholder={t('Describe what this recording does...')} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Recorder;
