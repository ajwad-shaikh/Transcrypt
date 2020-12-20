import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PostAddIcon from '@material-ui/icons/PostAdd';
import Error from '@material-ui/icons/Error';

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
  }
});

class Create extends React.Component {
  state = {
    ID: null,
    studentName: null,
    program: null,
    specialization: null,
    university: null,
    enrollmentId: null,
    graduationDate: null,
    creditsEarned: null,
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
    const { classes } = this.props;

    return (
      <form className="Main-inside" noValidate autoComplete="off">
        <Typography variant="h3">Create a Degree Record</Typography>
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
        <p>
          Degree ID is case sensitive and should start with 'DEGREE' followed by
          digits (e.g. DEGREE10)
        </p>
      </form>
    );
  }
}

export default withStyles(styles)(Create);
