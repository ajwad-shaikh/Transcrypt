import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Popover from "@material-ui/core/Popover";
import PostAddIcon from "@material-ui/icons/PostAdd";
import FingerprintIcon from "@material-ui/icons/Fingerprint";
import LockIcon from "@material-ui/icons/Lock";
import Error from "@material-ui/icons/Error";
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
  menu: {
    width: 200,
  },
  button: {
    marginTop: 20,
    marginLeft: 5,
    marginRight: 5,
  },
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
  }
});

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ID: null,
      studentName: null,
      program: null,
      specialization: null,
      university: null,
      enrollmentId: null,
      graduationDate: null,
      creditsEarned: null,
      anchorEl: null,
      issuer: null,
      popOpen: false,
    };
  }

  componentDidUpdate() {
    const { user } = this.props;
    const { issuer } = this.state;
    if(!issuer && user) {
      this.setState({
        issuer: `${user.displayName} (${user.email})`,
      });
    }
    else if (issuer && !user) {
      this.setState({
        issuer: null,
      });
    }
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

  createHandler = () => {
    //Check form validity
    if (
      !(
        this.state.ID &&
        this.state.studentName &&
        this.state.program &&
        this.state.specialization &&
        this.state.university &&
        this.state.enrollmentId &&
        this.state.graduationDate &&
        this.state.creditsEarned
      )
    ) {
      alert("All fields must be filled in");
    } else if (this.state.ID.slice(0, 6) !== "DEGREE") {
      alert('ID MUST CONTAIN "DEGREE" FOLLOWED BY ID');
    } else if (
      this.state.ID.slice(6).length > 3 ||
      isNaN(this.state.ID.slice(6))
    ) {
      alert('ID MUST CONTAIN "DEGREE" FOLLOWED BY ID BETWEEN 0 AND 999');
    } else {
      this.props.switchFeedHandler(1);
      this.props.socket.emit("REQUEST", { action: "CREATE", data: this.state });
    }
  };

  render() {
    const { popOpen, anchorEl } = this.state;
    const { classes, ready, user, signIn, signOut } = this.props;

    return (
      <form className="Main-inside" noValidate autoComplete="off">
      {user && (
          <div>
            <Typography variant="h3">
              {"Create a Degree Record "}
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
            <TextField
              label="Degree ID"
              className={classes.textField}
              value={this.state.name}
              onChange={this.handleChange("ID")}
              margin="normal"
            />
            <TextField
              label="Student Name"
              className={classes.textField}
              value={this.state.name}
              onChange={this.handleChange("studentName")}
              margin="normal"
            />
            <TextField
              label="Program"
              className={classes.textField}
              value={this.state.name}
              onChange={this.handleChange("program")}
              margin="normal"
            />
            <TextField
              label="Specialization"
              className={classes.textField}
              value={this.state.name}
              onChange={this.handleChange("specialization")}
              margin="normal"
            />
            <TextField
              label="University"
              className={classes.textField}
              value={this.state.name}
              onChange={this.handleChange("university")}
              margin="normal"
            />
            <TextField
              label="Enrollment ID"
              className={classes.textField}
              value={this.state.name}
              onChange={this.handleChange("enrollmentId")}
              margin="normal"
            />
            <TextField
              label="Graduation Date"
              className={classes.textField}
              value={this.state.name}
              onChange={this.handleChange("graduationDate")}
              margin="normal"
            />
            <TextField
              label="Credits Earned"
              className={classes.textField}
              value={this.state.name}
              onChange={this.handleChange("creditsEarned")}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              disabled={!this.props.connected}
              className={classes.button}
              startIcon={this.props.connected ? <PostAddIcon /> : <Error />}
              onClick={this.createHandler}
            >
              {this.props.connected ? "CREATE" : "DISCONNECTED"}
            </Button>
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
            <p>
              Degree ID is case sensitive and should start with 'DEGREE'
              followed by digits (e.g. DEGREE10)
            </p>
          </div>
        )}
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
      </form>
    );
  }
}

export default withStyles(styles)(Create);
