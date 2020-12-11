import React, { Component} from 'react';
//import { withStyles } from '@material-ui/core/styles';
//import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {post} from 'axios';
import QrReader from 'react-qr-reader';
class Verification extends Component {
    constructor(props){
        super(props);
        this.socket = this.props.socket
    }
    state = {
        image: null,
        ID: '',
        result: null,
        camera: false
    }
    onChangeHandler = (e) => {
        //console.log(e.target.files.item(0));
        //console.log(URL.createObjectURL(e.target.files[0]));
        this.setState({ 
            image: e.target.files[0],
            camera: false,
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        let response = await this.fileUpload(this.state.image);
        this.setState({
            ID: response.data[0].symbol[0].data
        })

        /*this.fileUpload(this.state.image).then((response) => {
            console.log(response.data[0].symbol[0].data);
            this.setState(
                {
                    degreeID : response.data[0].symbol[0].data 
                }
            )
        })*/
        console.log(`degree ID is ${this.state.ID}`)
        this.props.switchFeedHandler(1)
        this.socket.emit('REQUEST', {action: "QUERY", data:this.state})
    }

    fileUpload = (file) => {
        const url = 'http://api.qrserver.com/v1/read-qr-code/';
        const formData = new FormData();
        formData.append('file', file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return post(url, formData, config);
    }

    handleScan = data => {
        if (data) {
            console.log(data);
            this.setState({
                ID: data,
                camera: false
            })
            this.props.switchFeedHandler(1)
            this.socket.emit('REQUEST', {action: "QUERY", data:this.state})
        }
    }

    handleError = err => {
        console.error(err)
    }
    changeCameraState = () => {
        this.setState(prevState => ({
            camera: !prevState.camera,
            image: null
        }))
    }
    
    render() { 
        return ( 
            <div className = "Main-inside">
                <Typography  variant="display2">
                Verify Records
                </Typography>
                <br/>
                <br />
                {this.state.image && <img width = "10px" height = "10px" src = {URL.createObjectURL(this.state.image)} alt = "qr-code" ></img>}
                <center>{this.state.camera && <QrReader
                delay = { 300 }
                onError = { this.handleError }
                onScan = { this.handleScan }
                style = {{width: "200px", height: "200px"} }
                />}</center>
                <br />
                <br />
                <Button style = {{marginBottom: "20px"}} variant="contained" component="label" color = "primary" onClick = { this.changeCameraState}>
                Scan QR with Camera
                </Button>  
                <br/>OR<br/> 
                <form onSubmit = {this.handleSubmit}>
                    <Button style = {{marginRight: "20px", marginTop: "20px "}} variant="contained" component="label" color = "primary">
                    <input name="file" type="file" hidden onChange = {this.onChangeHandler}/>
                    Choose file
                    </Button>   
                    <Button style = {{marginTop: "20px "}} variant="contained" component="label">
                        <input type="submit" value="Read QR code" hidden/>
                        Read QR code
                    </Button>
                    
                </form>
            </div>
         );
    }
}
 
export default Verification;