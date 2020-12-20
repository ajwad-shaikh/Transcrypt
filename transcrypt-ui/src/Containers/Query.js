import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import Search from "@material-ui/icons/Search";
import CloudUpload from "@material-ui/icons/CloudUpload";
import Error from "@material-ui/icons/Error";
import { Button, Typography } from "@material-ui/core";
import QrReader from "react-qr-reader";
import { post } from "axios";

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
    marginLeft: theme.spacing(1),
  },
  qr: {
    marginLeft: "auto",
    marginRight: "auto",
  },
});

class Query extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ID: "",
      camera: false,
    };
    this.socket = this.props.socket;
    this.submitHandler = this.submitHandler.bind(this);
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleScan = (data) => {
    if (data) {
      console.log(data);
      this.setState({
        ID: data,
        camera: false,
      });
      this.submitHandler();
    }
  };

  handleError = (err) => {
    console.error(err);
  };

  onFileHandler = async (e) => {
    await this.setState({
      image: e.target.files[0],
    });
    let response = await this.fileUpload(this.state.image);
    console.log(response);
    this.setState({
      ID: response.data[0].symbol[0].data,
    });
    this.submitHandler();
  };

  fileUpload = (file) => {
    const url = "http://api.qrserver.com/v1/read-qr-code/";
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return post(url, formData, config);
  };

  submitHandler = () => {
    //check if data is correctly formatted
    if (!this.state.ID) {
      alert("ID field must be filled in");
    } else {
      //Switch to feed
      this.props.switchFeedHandler(1);
      this.socket.emit("REQUEST", { action: "QUERY", data: this.state });
    }
  };

  toggleCamera = () => {
    this.setState((prevState) => ({
      camera: !prevState.camera,
    }));
  };

  render() {
    const { classes } = this.props;
    const { camera } = this.state;
    return (
      <form className="Main-inside">
        <Typography variant="h3">Query a Degree Record</Typography>
        <TextField
          label="Degree ID"
          className={classes.textField}
          value={this.state.ID}
          onChange={this.handleChange("ID")}
          margin="normal"
        />
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={this.submitHandler}
          disabled={!this.props.connected}
          startIcon={this.props.connected ? <Search /> : <Error />}
        >
          {this.props.connected ? "SEARCH" : "DISCONNECTED"}
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={this.props.connected ? <PhotoCamera /> : <Error />}
          onClick={this.toggleCamera}
        >
          {this.props.connected ? "SCAN QR" : "DISCONNECTED"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          component="label"
          className={classes.button}
          startIcon={this.props.connected ? <CloudUpload /> : <Error />}
          >
          <input
            name="image"
            type="file"
            accept="image/*"
            hidden
            onChange={this.onFileHandler}
          />
          {this.props.connected ? "UPLOAD FILE" : "DISCONNECTED"}
        </Button>
        <br />
        {camera && (
          <QrReader
            className={classes.qr}
            delay={150}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{ width: "200px", height: "200px" }}
          />
        )}
        <p>
          Degree ID is case sensitive and should start with 'DEGREE' followed by
          digits (e.g. DEGREE10)
        </p>
      </form>
    );
  }
}

export default withStyles(styles)(Query);
