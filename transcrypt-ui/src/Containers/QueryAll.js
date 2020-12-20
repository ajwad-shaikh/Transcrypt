import React, {Component} from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Popover from "@material-ui/core/Popover";
import AllInbox from "@material-ui/icons/AllInbox";
import Error from "@material-ui/icons/Error";
import FingerprintIcon from "@material-ui/icons/Fingerprint";
import LockIcon from "@material-ui/icons/Lock";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";

const styles = (theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  button: {
    marginTop: 20,
    marginLeft: 5,
    marginRight: 5,
  },
  menu: {
    width: 200,
  },
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
  }
});

class QueryAll extends Component {

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      popOpen: false,
    };
  }

  handlePopoverOpen = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      popOpen: true,
    });
  };

  handlePopoverClose = (event) => {
    this.setState({
      anchorEl: null,
      popOpen: false,
    });
  };

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { popOpen, anchorEl } = this.state;
    const { classes, ready, user, signIn, signOut } = this.props;

    return (
      <div className="Main-inside">
        {!user && (
          <Button
            variant="contained"
            color="primary"
            disabled={!this.props.connected || !ready}
            className={classes.button}
            startIcon={this.props.connected ? <FingerprintIcon /> : <Error />}
            onClick={signIn}
          >
            {this.props.connected
              ? "Sign In to Access This Section"
              : "DISCONNECTED"}
          </Button>
        )}
        {user && (
          <div>
            <Typography variant="h3">
              {"Query All Records "}
              <VerifiedUserIcon
                onMouseEnter={this.handlePopoverOpen}
                onMouseLeave={this.handlePopoverClose}
              />
              <Popover
                className={classes.popover}
                classes={{
                  paper: classes.paper,
                }}
                open={popOpen}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                onClose={this.handlePopoverClose}
                disableRestoreFocus
              >
                {`Authenticated as ${user.displayName} (${user.email})`}
              </Popover>
            </Typography>
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={!this.props.connected}
              startIcon={this.props.connected ? <AllInbox /> : <Error />}
              onClick={() => {
                this.props.switchFeedHandler(1);
                this.props.socket.emit("REQUEST", { action: "QUERYALL" });
              }}
            >
              {this.props.connected ? "LIST ALL" : "DISCONNECTED"}
            </Button>
            <br />
            <br />
            <Button
              variant="outlined"
              color="secondary"
              disabled={!this.props.connected || !ready}
              className={classes.button}
              startIcon={this.props.connected ? <LockIcon /> : <Error />}
              onClick={signOut}
            >
              {this.props.connected ? "Log Out" : "DISCONNECTED"}
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(QueryAll);
