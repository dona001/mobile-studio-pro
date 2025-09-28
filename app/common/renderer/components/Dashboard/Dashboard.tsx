import React from 'react';
import {Link} from 'react-router';
import {CodeIcon, FileIcon, PlayIcon, RocketIcon} from '@radix-ui/react-icons';

const Dashboard: React.FC = () => {
  const quickActions = [
    {
      title: 'Start New Session',
      description: 'Connect to Appium server and start testing',
      icon: PlayIcon,
      href: '/session',
    },
    {
      title: 'Open Test Studio',
      description: 'Record and replay test scenarios',
      icon: RocketIcon,
      href: '/inspector',
    },
    {
      title: 'View Recordings',
      description: 'Manage your saved test recordings',
      icon: FileIcon,
      href: '/recordings',
    },
    {
      title: 'Generate Code',
      description: 'Export tests as Java POM code',
      icon: CodeIcon,
      href: '/code',
    },
  ];

  const stats = [
    {label: 'Total Sessions', value: '24', change: '+12%'},
    {label: 'Recordings', value: '8', change: '+3'},
    {label: 'Tests Generated', value: '156', change: '+28'},
    {label: 'Success Rate', value: '94%', change: '+2%'},
  ];

  return (
    <div className="content">
      {/* Welcome Section */}
      <div
        className="card"
        style={{background: 'linear-gradient(135deg, var(--ocbc-red), #CC0010)', color: 'white'}}
      >
        <h1 style={{fontSize: '1.5rem', fontWeight: '700', margin: '0 0 0.5rem 0'}}>
          Welcome to OCBC Test Studio
        </h1>
        <p style={{margin: 0, opacity: 0.9}}>
          Your comprehensive mobile testing platform for building, recording, and executing
          automated tests.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#10B981',
                marginTop: '0.25rem',
                fontWeight: '500',
              }}
            >
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--ocbc-text)',
            margin: '0 0 1rem 0',
          }}
        >
          Quick Actions
        </h2>
        <div className="dashboard-grid">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href} className="quick-action-card">
              <div className="quick-action-icon">
                <action.icon style={{width: '24px', height: '24px', color: 'white'}} />
              </div>
              <h3 className="quick-action-title">{action.title}</h3>
              <p className="quick-action-description">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--ocbc-text)',
            margin: '0 0 1rem 0',
          }}
        >
          Recent Activity
        </h2>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem',
              backgroundColor: 'var(--ocbc-bg)',
              borderRadius: '8px',
            }}
          >
            <div
              style={{width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%'}}
            ></div>
            <div style={{flex: 1}}>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--ocbc-text)',
                  margin: '0 0 0.25rem 0',
                }}
              >
                Session completed successfully
              </p>
              <p style={{fontSize: '0.75rem', color: 'var(--ocbc-text-light)', margin: 0}}>
                2 minutes ago
              </p>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem',
              backgroundColor: 'var(--ocbc-bg)',
              borderRadius: '8px',
            }}
          >
            <div
              style={{width: '8px', height: '8px', backgroundColor: '#3B82F6', borderRadius: '50%'}}
            ></div>
            <div style={{flex: 1}}>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--ocbc-text)',
                  margin: '0 0 0.25rem 0',
                }}
              >
                New recording saved
              </p>
              <p style={{fontSize: '0.75rem', color: 'var(--ocbc-text-light)', margin: 0}}>
                15 minutes ago
              </p>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem',
              backgroundColor: 'var(--ocbc-bg)',
              borderRadius: '8px',
            }}
          >
            <div
              style={{width: '8px', height: '8px', backgroundColor: '#8B5CF6', borderRadius: '50%'}}
            ></div>
            <div style={{flex: 1}}>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--ocbc-text)',
                  margin: '0 0 0.25rem 0',
                }}
              >
                Code generated for Login Flow
              </p>
              <p style={{fontSize: '0.75rem', color: 'var(--ocbc-text-light)', margin: 0}}>
                1 hour ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
