import { createMuiTheme, colors } from '@material-ui/core';
const { blue, pink } = colors;

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink
  }
});

export default theme;
