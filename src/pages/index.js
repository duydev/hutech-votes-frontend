import {
  withStyles,
  Paper,
  Grid,
  Typography,
  TextField,
  Button
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { getResultMessage } from '../utils';

import styles from './styles/home';

class HomePage extends React.Component {
  state = {
    time: '',
    success: false,
    message: ''
  };

  handleChangeTime = e => {
    const value = e.target.value;

    this.setState({ time: value });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { time } = this.state;

    if (!time) return;

    this.setState({ success: false, message: '' }, () => {
      const { success, message } = getResultMessage(time);

      this.setState({ success, message });
    });
  };

  render() {
    const { classes } = this.props;
    const { time, success, message } = this.state;

    return (
      <Grid className={classes.root} container justify="center">
        <Grid item md={6} xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h4" align="center">
              Tính Tiền Phạt Đi Trễ
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    type="time"
                    label="Alarm clock"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true
                    }}
                    fullWidth
                    value={time}
                    onChange={this.handleChangeTime}
                  />
                </Grid>
                <Grid item xs={12} container justify="center">
                  <Button type="submit" variant="contained" color="primary">
                    Tính tiền phạt
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  {!!message && (
                    <Alert
                      variant="filled"
                      severity={success ? 'success' : 'error'}
                    >
                      {message}
                    </Alert>
                  )}
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles, { name: 'HomePage' })(HomePage);
