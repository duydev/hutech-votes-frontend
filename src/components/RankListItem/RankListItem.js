import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Link from 'next/link';
import moment from 'moment';

import {
  withStyles,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Tooltip
} from '@material-ui/core';

import styles from './styles';

class RankListItem extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  render() {
    const { classes, className, item, rank } = this.props;
    const { id, name, image, title, votes, updatedAt } = item;

    const detailURL = `/candidate/${id}`;

    return (
      <ListItem className={clsx(classes.root, className)}>
        <div className={classes.rank}>{String(rank).padStart(2, '0')}</div>
        <ListItemAvatar>
          <Avatar src={image} alt={name} />
        </ListItemAvatar>
        <ListItemText
          classes={{
            primary: classes.name,
            secondary: classes.title
          }}
          primary={
            <Link href={detailURL}>
              <a className={classes.link}>{name}</a>
            </Link>
          }
          secondary={title}
        />
        <div className={classes.votes}>
          <Tooltip
            title={`Lần cập nhật cuối: ${moment(updatedAt).format(
              'HH:mm:ss DD/MM/YYYY'
            )}`}
          >
            <span>{Intl.NumberFormat('en-US').format(votes)}</span>
          </Tooltip>
        </div>
      </ListItem>
    );
  }
}

export default withStyles(styles, { name: 'RankListItem' })(RankListItem);
