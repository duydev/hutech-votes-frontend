import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';

import { withStyles, Typography } from '@material-ui/core';
import RankList from '../../components/RankList';
import RankListItem from '../../components/RankListItem';

import { paginateCandidates } from '../../apis';

import styles from './styles';

class CandidateRankList extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    categoryId: PropTypes.number,
    limit: PropTypes.number,
    onLoading: PropTypes.func
  };

  state = {
    loading: false,
    error: false,
    items: []
  };

  fetchData = () => {
    const { categoryId, limit } = this.props;

    const query = {
      limit: 1000
    };

    if (categoryId && !Number.isNaN(categoryId)) {
      query.categoryId = categoryId;
    }

    if (limit && !Number.isNaN(limit)) {
      query.limit = limit;
    }

    this.setState({ loading: true, error: null, items: [] }, async () => {
      try {
        const { docs } = await paginateCandidates(query);

        this.setState({ loading: false, items: docs });
      } catch (error) {
        this.setState({ loadinng: false, error });
      }
    });
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.loading !== this.state.loading) {
      if (this.props.onLoading) {
        this.props.onLoading(this.state.loading);
      }
    }
  }

  render() {
    const { classes, className } = this.props;
    const { items } = this.state;

    let lastUpdated = 'N/A';

    if (items && items.length) {
      const { updatedAt } = items[0];

      lastUpdated = moment(updatedAt).format('HH:mm:ss DD/MM/YYYY');
    }

    return (
      <div className={clsx(classes.root, className)}>
        <Typography
          variant="inherit"
          align="center"
          className={classes.lastUpdated}
        >
          Lần cập nhật cuối: {lastUpdated}
        </Typography>
        <RankList className={classes.list}>
          {items.map((item, index) => (
            <RankListItem
              key={item.id}
              className={classes.item}
              rank={index + 1}
              item={item}
            />
          ))}
        </RankList>
      </div>
    );
  }
}

export default withStyles(styles, { name: 'CandidateRankList' })(
  CandidateRankList
);
