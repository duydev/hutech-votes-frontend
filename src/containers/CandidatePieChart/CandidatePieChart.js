import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Pie } from 'react-chartjs-2';
import palette from 'google-palette';

import { withStyles } from '@material-ui/core';

import { paginateCandidates } from '../../apis';

import styles from './styles';

class CandidatePieChart extends React.Component {
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

    this.setState(
      { loading: true, error: null, labels: [], datasets: [] },
      async () => {
        try {
          const { docs } = await paginateCandidates(query);

          const { labels, data } = docs.reduce(
            (obj, { name, votes }) => {
              obj.labels.push(name);
              obj.data.push(votes);

              return obj;
            },
            {
              labels: [],
              data: []
            }
          );

          const backgroundColor = palette('mpn65', data.length).map(
            hex => `#${hex}`
          );

          this.setState({
            loading: false,
            labels,
            datasets: [
              {
                data,
                backgroundColor
              }
            ]
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
            const { labels, datasets } = chart.data;
            const [dataset] = datasets;

            if (!dataset) return [];

            const meta = dataset._meta[chartId] || {};

            const legend = labels.map((label, index) => {
              let newLabel = label.split(' ');
              newLabel = newLabel[newLabel.length - 1];
              newLabel = `${newLabel}`;

              return {
                datasetIndex: 0,
                fillStyle:
                  dataset.backgroundColor && dataset.backgroundColor[index],
                text: newLabel,
                index,
                hidden: meta.data[index].hidden
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
        <Pie data={{ labels, datasets }} options={options} />
      </div>
    );
  }
}

export default withStyles(styles, { name: 'CandidatePieChart' })(
  CandidatePieChart
);
