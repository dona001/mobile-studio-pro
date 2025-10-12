import ExperitestLogo from '../../assets/images/experitest_logo.svg';
import {SERVER_TYPES} from '../../constants/session-builder.js';
import {useTheme} from '../../hooks/use-theme';
import ServerTabExperitest from './ServerTabExperitest.jsx';
import SessionStyles from './Session.module.css';

const providers = {
  [SERVER_TYPES.EXPERITEST]: {
    tab: ServerTabExperitest,
    logos: {
      light: ExperitestLogo,
      dark: null,
    },
  },
};

const ProviderLogo = ({serverType}) => {
  const {isDarkTheme} = useTheme();
  const {logos} = providers[serverType];

  if (!logos) {
    return null;
  }

  const logo = isDarkTheme && logos.dark ? logos.dark : logos.light;

  return <img src={logo} />;
};

const CloudProviders = Object.entries(providers).reduce((acc, [serverType, provider]) => {
  const logo = <ProviderLogo serverType={serverType} />;

  acc[serverType] = {
    tabhead: () => <span className={SessionStyles.tabText}>{logo}</span>,
    tab: (props) => <provider.tab {...props} />,
    logo,
  };

  return acc;
}, {});

export default CloudProviders;
