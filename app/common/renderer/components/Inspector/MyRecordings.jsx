import {
  DeleteOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import {Button, Card, List, Modal, Progress, Space, Tag, Tooltip, Typography} from 'antd';
import {useEffect} from 'react';

import {BUTTON} from '../../constants/antd-types';
import InspectorStyles from './Inspector.module.css';

const {Text, Title} = Typography;

const MyRecordings = (props) => {
  const {
    savedRecordings,
    isLoadingRecordings,
    isReplaying,
    currentReplayRecording,
    replayProgress,
    replayError,
    getSavedRecordings,
    startReplay,
    stopReplay,
    deleteRecording,
    t,
  } = props;

  useEffect(() => {
    getSavedRecordings();
  }, [getSavedRecordings]);

  const handleReplay = (recordingId) => {
    // Check if we have an active session before starting replay
    if (!props.serverDetails || !props.sessionCaps) {
      Modal.error({
        title: t('No Active Session'),
        content: t('Please start a session before replaying recordings.'),
      });
      return;
    }
    startReplay(recordingId);
  };

  const handleStopReplay = () => {
    stopReplay();
  };

  const handleDeleteRecording = (recordingId, recordingName) => {
    Modal.confirm({
      title: t('Delete Recording'),
      content: t('Are you sure you want to delete "{{name}}"?', {name: recordingName}),
      okText: t('Delete'),
      okType: 'danger',
      cancelText: t('Cancel'),
      onOk: () => deleteRecording(recordingId),
    });
  };

  const formatDate = (timestamp) => new Date(timestamp).toLocaleString();

  const getActionCount = (actions) => actions ? actions.length : 0;

  return (
    <Card
      title={
        <span>
          <FileTextOutlined /> {t('My Recordings')}
        </span>
      }
      className={InspectorStyles['interaction-tab-card']}
    >
      {isReplaying && (
        <Card size="small" style={{marginBottom: 16, backgroundColor: '#f0f9ff'}}>
          <Space direction="vertical" style={{width: '100%'}}>
            <Space>
              <Text strong>
                {t('Replaying:')} {currentReplayRecording?.name}
              </Text>
              <Button size="small" icon={<StopOutlined />} onClick={handleStopReplay} danger>
                {t('Stop')}
              </Button>
            </Space>
            <Progress
              percent={Math.round((replayProgress.currentStep / replayProgress.totalSteps) * 100)}
              status={replayError ? 'exception' : 'active'}
              format={() => `${replayProgress.currentStep}/${replayProgress.totalSteps}`}
            />
            {replayError && (
              <Text type="danger">
                {t('Replay Error:')} {replayError}
              </Text>
            )}
          </Space>
        </Card>
      )}

      {isLoadingRecordings ? (
        <div style={{textAlign: 'center', padding: '20px'}}>
          <Text>{t('Loading recordings...')}</Text>
        </div>
      ) : savedRecordings.length === 0 ? (
        <div style={{textAlign: 'center', padding: '20px'}}>
          <Text type="secondary">
            {t('No saved recordings yet. Record some actions and save them!')}
          </Text>
        </div>
      ) : (
        <List
          dataSource={savedRecordings}
          renderItem={(recording) => (
            <List.Item
              actions={[
                <Tooltip title={t('Replay Recording')}>
                  <Button
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleReplay(recording.id)}
                    disabled={isReplaying}
                    type={BUTTON.PRIMARY}
                    size="small"
                  />
                </Tooltip>,
                <Tooltip title={t('Delete Recording')}>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteRecording(recording.id, recording.name)}
                    disabled={isReplaying}
                    danger
                    size="small"
                  />
                </Tooltip>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <Text strong>{recording.name}</Text>
                    <Tag color="blue">
                      {getActionCount(recording.actions)} {t('actions')}
                    </Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical" size="small">
                    <Text type="secondary">{recording.description}</Text>
                    <Text type="secondary" style={{fontSize: '12px'}}>
                      {t('Created:')} {formatDate(recording.createdAt)}
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default MyRecordings;
