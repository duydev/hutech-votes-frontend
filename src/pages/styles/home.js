export default theme => ({
  root: {
    paddingTop: theme.spacing(3)
  },
  paper: {
    padding: theme.spacing(2)
  },
  form: {
    padding: theme.spacing(2),
    paddingBottom: 0
  },
  textField: {
    fontSize: '2em'
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2)
  },
  footerLink: {
    paddingLeft: '4px',
    textDecoration: 'none',
    fontWeight: 700,
    color: 'inherit'
  }
});
