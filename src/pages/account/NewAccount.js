import React from 'react';
import AccountTabs from './AccountTabs';

const NewAccount = ({ t, location, history, match }) => {
  return <AccountTabs match={match} history={history} t={t} />;
};

export default NewAccount;
