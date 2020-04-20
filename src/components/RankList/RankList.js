import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { withStyles, List } from '@material-ui/core';

import styles from './styles';

class RankList extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  render() {
    const { classes, className, children, ...otherProps } = this.props;

    return (
      <List className={clsx(classes.root, className)} {...otherProps}>
        {children}
      </List>
    );
  }
}

export default withStyles(styles, { name: 'RankList' })(RankList);
