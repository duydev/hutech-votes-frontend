import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, Backdrop, CircularProgress } from '@material-ui/core';

import styles from './styles';

const ScreenLoading = ({ classes, open }) => {
  return (
    <Backdrop className={classes.backdrop} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

ScreenLoading.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired
};

export default withStyles(styles, { name: 'ScreenLoading' })(ScreenLoading);
