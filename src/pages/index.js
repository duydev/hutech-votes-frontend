import Link from 'next/link';
import Head from 'next/head';
import { withRouter } from 'next/router';

import {
  withStyles,
  Paper,
  Grid,
  Typography,
  Tabs,
  Tab,
  AppBar,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@material-ui/core';

import CandidateRankList from '../containers/CandidateRankList';
import Footer from '../components/Footer';
import ScreenLoading from '../components/ScreenLoading';
import CandidatePieChart from '../containers/CandidatePieChart';
import CandidateLineChart from '../containers/CandidateLineChart';

import { initGA, logPageView, logEvent } from '../utils/analytics';
import { paginateCategories } from '../apis';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(1)
  },
  appBar: {
    marginTop: theme.spacing(3)
  },
  tabTitle: {
    fontWeight: 'bold'
  },
  tabContent: {
    margin: theme.spacing(2, 0)
  },
  chartWrapper: {
    padding: theme.spacing(2, 0)
  },
  source: {
    display: 'block',
    textAlign: 'center'
  },
  [theme.breakpoints.up('sm')]: {
    root: {
      paddingTop: theme.spacing(3)
    },
    paper: {
      padding: theme.spacing(2)
    },
    appBar: {
      marginTop: theme.spacing(4)
    },
    tabTitle: {
      fontWeight: 700
    },
    source: {
      textAlign: 'right',
      padding: theme.spacing(0, 2)
    }
  }
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

class HomePage extends React.Component {
  state = {
    loading: true, // false,
    error: null,
    items: [],
    currentTab: 0,
    openDialog: false
  };

  fetchData = () => {
    this.setState({ /* loading: true, */ error: null, items: [] }, async () => {
      try {
        const { docs } = await paginateCategories();

        this.setState({ /* loading: false, */ items: docs });
      } catch (error) {
        this.setState({ /* loading: false , */ error });
      }
    });
  };

  toggleLoading = open => {
    this.setState({ loading: open });
  };

  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }

    logPageView();

    this.fetchData();
  }

  handleChangeTab = (e, index) => {
    this.setState({ currentTab: index });
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  render() {
    const { classes, router } = this.props;
    const { items, currentTab, loading, pieChart, openDialog } = this.state;

    const tabItems = [{ id: 0, name: 'Tất Cả' }, ...items];

    const siteTitle = `Trang Chủ - Bảng xếp hạng và thống kê HUTECH's Face`;
    const currentURL = `https://votes.duydev.design` + router.asPath;
    const shortDescription = `Một chiếc tool cực cool hỗ trợ bình chọn cho các cuộc thi của HUTECH.`;
    const image = `https://cdn.shopify.com/s/files/1/0827/8189/articles/analytics_ee8142c6-2dfa-4c83-a5be-6d1a66858799_1200x.jpg?v=1566890663`;

    return (
      <>
        <Head>
          <title>{siteTitle}</title>
          <meta property="og:url" content={currentURL} />
          <meta property="og:title" content={siteTitle} />
          <meta property="og:description" content={shortDescription} />
          <meta property="og:image" content={image} />
        </Head>
        <Grid className={classes.root} container justify="center">
          <Grid item md={8} xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h4" align="center">
                Bảng xếp hạng và thống kê HUTECH's Face
              </Typography>
              <Typography variant="inherit" className={classes.source}>
                Nguồn dữ liệu:{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.hutech.edu.vn/hutechface/"
                >
                  https://www.hutech.edu.vn/hutechface/
                </a>
              </Typography>
              <AppBar position="static" className={classes.appBar}>
                <Tabs
                  variant="scrollable"
                  scrollButtons="auto"
                  value={currentTab}
                  onChange={this.handleChangeTab}
                >
                  {tabItems.map((item, index) => (
                    <Tab
                      key={item.id}
                      label={item.name}
                      classes={{ wrapper: classes.tabTitle }}
                    />
                  ))}
                </Tabs>
              </AppBar>
              {tabItems.map((item, index) => (
                <TabPanel key={item.id} value={currentTab} index={index}>
                  <Grid container className={classes.tabContent}>
                    <Grid item xs={12} sm={12} className={classes.chartWrapper}>
                      <CandidateLineChart
                        categoryId={item.id}
                        onLoading={this.toggleLoading}
                        title="Số lượt bình chọn trong 2 tuần"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CandidateRankList
                        categoryId={item.id}
                        onLoading={this.toggleLoading}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
              ))}
            </Paper>
            <Footer />
          </Grid>
        </Grid>
        <ScreenLoading open={loading} />
        <Dialog open={openDialog} onClose={this.handleCloseDialog}>
          <DialogTitle>Tin nhắn</DialogTitle>
          <DialogContent>Hack số ghê vậy mấy cha. =))))</DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default withRouter(withStyles(styles, { name: 'HomePage' })(HomePage));
