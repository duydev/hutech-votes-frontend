export default theme => ({
  root: {
    display: 'flex',
    flexFlow: 'column',
    marginTop: theme.spacing(2)
  },
  list: {},
  item: {},
  lastUpdated: {
    fontWeight: 500
  },
  [theme.breakpoints.up('sm')]: {
    lastUpdated: {
      fontWeight: 500,
      textAlign: 'right'
    }
  }
});
