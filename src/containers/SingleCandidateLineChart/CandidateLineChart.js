import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Line } from 'react-chartjs-2';
import palette from 'google-palette';
import moment from 'moment';
import _ from 'lodash';

import { withStyles } from '@material-ui/core';

import { getVoteHistoryByCandidateId } from '../../apis';

import { generateArrayDate } from '../../utils';

import styles from './styles';

class CandidateLineChart extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    onLoading: PropTypes.func,
    categoryId: PropTypes.number,
    limit: PropTypes.number,
    title: PropTypes.string
  };

  state = {
    loading: false,
    error: null,
    labels: [],
    datasets: []
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { candidateId } = this.props;

    this.setState(
      { loading: true, error: null, labels: [], datasets: [] },
      async () => {
        try {
          const labels = Array(16)
            .fill()
            .map((elm, index) =>
              moment('2020-04-20').subtract(index, 'days').format('DD/MM/YYYY')
            )
            .reverse();

          let data = await getVoteHistoryByCandidateId(candidateId);
          data = [data];

          const datasets = data.map(({ id, name, history }) => {
            const lineData = labels.map(date => history[date] || 0);

            return {
              label: name,
              data: lineData,
              fill: false
            };
          });

          const colors = palette('mpn65', datasets.length)
            .map(hex => `#${hex}`)
            .forEach((color, index) => {
              datasets[index].borderColor = color;
            });

          this.setState({
            loading: false,
            labels,
            datasets
          });
        } catch (error) {
          this.setState({ loading: false, error });
        }
      }
    );
  };

  render() {
    const { classes, className, title } = this.props;
    const { labels, datasets } = this.state;

    const options = {
      maintainAspectRatio: false,
      legend: {
        labels: {
          boxWidth: 20,
          generateLabels: chart => {
            const chartId = chart.id;
            const { datasets } = chart.data;

            var legend = datasets.map((dataset, index) => {
              const meta = dataset._meta[chartId] || {};

              let newLabel = dataset.label.split(' ');
              newLabel = newLabel[newLabel.length - 1];
              newLabel = `${newLabel}`;

              return {
                datasetIndex: index,
                text: newLabel,
                fillStyle: dataset.backgroundColor,
                strokeStyle: dataset.borderColor,
                index,
                hidden: meta.hidden
              };
            });

            return legend;
          }
        }
      }
    };

    if (title) {
      options.title = {
        display: true,
        text: title
      };
    }

    return (
      <div className={clsx(classes.root, className)}>
        <Line data={{ labels, datasets }} options={options} />
      </div>
    );
  }
}

export default withStyles(styles, { name: 'CandidateLineChart' })(
  CandidateLineChart
);
