import {BankOutlined} from '@ant-design/icons';
import {Typography} from 'antd';

const {Title} = Typography;

const OCBCHeader = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 24px',
        backgroundColor: '#F8F8F8',
        borderBottom: '2px solid #E60012',
        marginBottom: '16px',
      }}
    >
      <BankOutlined
        style={{
          fontSize: '32px',
          color: '#E60012',
          marginRight: '16px',
        }}
      />
      <div>
        <Title
          level={2}
          style={{
            margin: 0,
            color: '#E60012',
            fontWeight: 'bold',
          }}
        >
          OCBC Test Studio
        </Title>
        <Title
          level={5}
          style={{
            margin: 0,
            color: '#333333',
            fontWeight: 'normal',
          }}
        >
          Mobile App Testing & Automation Platform
        </Title>
      </div>
    </div>
  );

export default OCBCHeader;
