const common = {
  color: 'rgba(0, 0, 0, 0.54)',
  display: 'inline-flex',
  flexShrink: 0
};

export default theme => ({
  root: {},
  rank: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    minWidth: '30px',
    ...common
  },
  votes: {
    justifyContent: 'end',
    fontSize: '1em',
    minWidth: '30px',
    ...common
  },
  name: {
    fontSize: '1.2em',
    fontWeight: 700
  },
  title: {},
  link: {
    color: 'initial',
    textDecoration: 'initial'
  },
  [theme.breakpoints.up('sm')]: {
    rank: {
      fontSize: '2em',
      fontWeight: 700,
      minWidth: '56px'
    },
    votes: {
      justifyContent: 'end',
      fontSize: '1.3em',
      minWidth: '56px'
    }
  }
});
