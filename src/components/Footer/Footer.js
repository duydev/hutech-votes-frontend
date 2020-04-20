import React from 'react';
import clsx from 'clsx';

import { withStyles, Typography } from '@material-ui/core';

import styles from './styles';

const Footer = ({ classes, className }) => {
  return (
    <div className={clsx(classes.root, className)}>
      <Typography className={classes.text} variant="inherit">
        Made with ❤️ by
        <a className={classes.link} href="https://duydev.me">
          Trần Nhật Duy
        </a>
        .
      </Typography>
    </div>
  );
};

export default withStyles(styles, { name: 'Footer' })(Footer);
