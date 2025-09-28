import {App, ConfigProvider, Layout, theme} from 'antd';
import {createContext, useEffect, useState} from 'react';

import {PREFERRED_THEME} from '../../shared/setting-defs';
import Notification from '../components/Notification';
import {getSetting, setSetting, setTheme} from '../polyfills';
import {loadHighlightTheme} from '../utils/highlight-theme';

const systemPrefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

export const ThemeContext = createContext(null);

export const ThemeProvider = ({children}) => {
  const [preferredTheme, setPreferredTheme] = useState('system');

  const isDarkTheme =
    preferredTheme === 'dark' || (preferredTheme === 'system' && systemPrefersDarkTheme);

  loadHighlightTheme(isDarkTheme);

  useEffect(() => {
    initTheme();
  }, []);

  const handleDarkClass = () => {
    if (isDarkTheme) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  handleDarkClass();

  const initTheme = async () => {
    const savedTheme = await getSetting(PREFERRED_THEME);
    setTheme(savedTheme);
    setPreferredTheme(savedTheme);
  };

  const updateTheme = async (theme) => {
    setTheme(theme);
    setPreferredTheme(theme);
    await setSetting(PREFERRED_THEME, theme);
  };

  const themeConfig = {
    algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorBgLayout: isDarkTheme ? '#191919' : '#F8F8F8', // OCBC Background
      colorPrimary: '#E60012', // OCBC Red
      colorText: isDarkTheme ? '#ffffff' : '#333333', // OCBC Dark Grey
      colorTextSecondary: isDarkTheme ? '#cccccc' : '#666666',
      colorBgContainer: isDarkTheme ? '#1f1f1f' : '#ffffff',
      fontSize: 12,
    },
    components: {
      Badge: {
        colorError: '#E60012', // OCBC Red
        indicatorHeight: 20,
        textFontSize: 12,
      },
      Switch: {
        handleSize: 18,
        trackHeight: 22,
        trackMinWidth: 44,
      },
      Tabs: {
        titleFontSize: 14,
        colorPrimary: '#E60012', // OCBC Red
      },
      Button: {
        colorPrimary: '#E60012', // OCBC Red
        colorPrimaryHover: '#cc0010',
        colorPrimaryActive: '#b3000e',
      },
      Select: {
        colorPrimary: '#E60012', // OCBC Red
        colorPrimaryHover: '#cc0010',
      },
      Card: {
        colorBorder: '#E60012', // OCBC Red accent
      },
    },
  };

  return (
    <ThemeContext.Provider value={{updateTheme, preferredTheme, isDarkTheme}}>
      <ConfigProvider theme={themeConfig}>
        <App>
          <Layout>{children}</Layout>
          <Notification />
        </App>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
