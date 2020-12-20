import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AllInbox from "@material-ui/icons/AllInbox";
import Error from "@material-ui/icons/Error";

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
});

class QueryAll extends React.Component {
  state = {};

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className="Main-inside">
        <Typography variant="h3">Query All Degrees</Typography>
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
      </div>
    );
  }
}

export default withStyles(styles)(QueryAll);
