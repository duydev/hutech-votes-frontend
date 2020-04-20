import Link from 'next/link';
import Head from 'next/head';
import { withRouter } from 'next/router';
import moment from 'moment';

import {
  withStyles,
  Paper,
  Grid,
  Typography,
  Avatar,
  Button,
  Snackbar
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import Footer from '../../components/Footer';
import ScreenLoading from '../../components/ScreenLoading';
import SingleCandidateLineChart from '../../containers/SingleCandidateLineChart';

import { initGA, logPageView, logEvent } from '../../utils/analytics';
import { paginateCandidates, getCandidateById, vote } from '../../apis';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing(3)
  },
  paper: {
    padding: theme.spacing(2)
  },
  content: {
    marginTop: theme.spacing(3)
  },
  avatarWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    width: 128,
    height: 128
  },
  infoWrapper: {
    paddingTop: theme.spacing(3),
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center'
  },
  name: {
    lineHeight: '47px'
  },
  title: {
    lineHeight: '32px'
  },
  votes: {
    lineHeight: '32px'
  },
  lastUpdated: {
    lineHeight: '32px'
  },
  buttonVote: {
    margin: theme.spacing(2, 0)
  },
  description: {
    margin: theme.spacing(2, 0)
  },
  descriptionImage: {
    float: 'initial !important',
    marginRight: theme.spacing(2)
  },
  source: {
    display: 'block',
    textAlign: 'center'
  },
  [theme.breakpoints.up('sm')]: {
    avatar: {
      width: 200,
      height: 200
    },
    source: {
      textAlign: 'right',
      padding: theme.spacing(0, 2)
    }
  }
});

class CandidateDetailPage extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (props.item.votes > state.votes) {
      return {
        votes: props.item.votes
      };
    }

    return null;
  }

  state = {
    loading: false,
    error: null,
    votes: 0,
    notify: false,
    notifyMessage: null,
    notifySuccess: false
  };

  fetchData = () => {
    const { id } = this.props.item;

    this.setState({ loading: true, error: null }, async () => {
      try {
        const { votes } = await getCandidateById(id);

        this.setState({ loading: false, votes });
      } catch (error) {
        this.setState({ loading: false, error });
      }
    });
  };

  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }

    logPageView();

    this.fetchData();
  }

  handleVote = () => {
    const { id, name } = this.props.item;

    this.setState({ loading: true, error: null }, async () => {
      try {
        logEvent('Vote Button', 'Click');

        const { success } = await vote(id);

        const { votes } = await getCandidateById(id);

        this.setState({ loading: false, votes }, () => {
          this.notify(
            success
              ? `Bạn đã bình chọn cho ${name} thành công.`
              : 'Lượt bình chọn gặp sự cố. Vui lòng thử lại.',
            success
          );
        });
      } catch (error) {
        this.setState({ loading: false, error });
      }
    });
  };

  notify(message, success) {
    this.setState({
      notify: true,
      notifyMessage: message,
      notifySuccess: success
    });
  }

  handleCloseNotify = () => {
    this.setState({ notify: false });
  };

  render() {
    const { classes, item, router } = this.props;
    const { votes, loading, notify, notifyMessage, notifySuccess } = this.state;
    const { id, image, name, title, description, updatedAt } = item;

    let htmlDescription = description
      .split('src="/hutechface')
      .join('src="https://www.hutech.edu.vn/hutechface');

    htmlDescription = htmlDescription
      .split('alt')
      .join(`class="${classes.descriptionImage}" alt`);

    const siteTitle = `Thí sinh ${name} - Bảng xếp hạng và thống kê HUTECH's Face`;
    const currentURL = `https://votes.duydev.design` + router.asPath;
    const shortDescription = String(description)
      .replace(/<[^>]*>/gi, '')
      .trim()
      .slice(0, 200);

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
              <Link href="/">
                <Button> &laquo; Về Trang Chủ</Button>
              </Link>
              <Grid container className={classes.content}>
                <Grid item xs={12} sm={4} className={classes.avatarWrapper}>
                  <Avatar src={image} alt={name} className={classes.avatar} />
                </Grid>
                <Grid item xs={12} sm={8} className={classes.infoWrapper}>
                  <Typography
                    variant="h4"
                    className={classes.name}
                    align="center"
                  >
                    {name}
                  </Typography>
                  <Typography
                    variant="h6"
                    className={classes.title}
                    align="center"
                  >
                    {title}
                  </Typography>
                  <Typography
                    variant="inherit"
                    className={classes.votes}
                    align="center"
                  >
                    Lượt bình chọn: {Intl.NumberFormat('en-US').format(votes)}
                  </Typography>
                  <Typography
                    variant="inherit"
                    className={classes.lastUpdated}
                    align="center"
                  >
                    Lần cập nhật cuối:{' '}
                    {moment(updatedAt).format('HH:mm:ss DD/MM/YYYY')}
                  </Typography>
                  <SingleCandidateLineChart
                    candidateId={id}
                    title="Lượt bình chọn trong 2 tuần"
                  />
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
                </Grid>
                <Grid item xs={12} className={classes.description}>
                  <div dangerouslySetInnerHTML={{ __html: htmlDescription }} />
                </Grid>
              </Grid>
            </Paper>
            <Footer />
          </Grid>
        </Grid>
        <ScreenLoading open={loading} />
        <Snackbar
          open={notify}
          autoHideDuration={3000}
          onClose={this.handleCloseNotify}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            elevation={6}
            variant="filled"
            onClose={this.handleCloseNotify}
            severity={notifySuccess ? 'success' : 'error'}
          >
            {notifyMessage}
          </Alert>
        </Snackbar>
      </>
    );
  }
}

export async function getStaticProps(context) {
  const {
    params: { id }
  } = context;

  const item = await getCandidateById(id);

  return {
    props: { item }
  };
}

export async function getStaticPaths() {
  const { docs } = await paginateCandidates({ limit: 1000 });

  const paths = docs.map(({ id }) => ({ params: { id: `${id}` } }));

  return {
    paths,
    fallback: false
  };
}

export default withRouter(
  withStyles(styles, { name: 'CandidateDetailPage' })(CandidateDetailPage)
);
