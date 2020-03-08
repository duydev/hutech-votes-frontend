import ReactGA from 'react-ga';

export const initGA = () => {
  ReactGA.initialize('UA-77390738-12');
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

export const logEvent = (category = '', action = '', value) => {
  if (category && action) {
    ReactGA.event({ category, action, value });
  }
};

export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal });
  }
};
