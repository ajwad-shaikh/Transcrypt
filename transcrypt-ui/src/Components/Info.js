import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import SchoolIcon from "@material-ui/icons/School";
import Logo from "../Components/Logo";
import { ListItemAvatar } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    position: "relative",
    overflow: "auto",
    maxHeight: "85%",
    backgroundColor: theme.palette.background.paper,
  },
});

function FolderList(props) {
  const { classes } = props;
  console.log(props.data);
  return (
    <div className={classes.root}>
      {props.data.length > 0 ? (
        <List dense>
          {props.data.map((degree) => {
            return (
              <ListItem key={degree.Key}>
                <ListItemAvatar>
                  <Avatar>
                    <SchoolIcon />
                  </Avatar>
                </ListItemAvatar>
                {degree.Record ? (
                  <ListItemText
                    primary={degree.Key}
                    secondary={`${degree.Record.university} hereby confers upon ${degree.Record.studentName} 
                                the degree of ${degree.Record.program} in ${degree.Record.specialization} with 
                                all the rights, privileges and honors appertaining ${degree.Record.graduationDate}
                                in recognition of the fulfillment of degree requirement of 
                                ${degree.Record.creditsEarned} credits as issued by ${degree.Record.issuer}.`}
                  />
                ) : (
                  <ListItemText primary={degree.Key} secondary={degree.Msg} />
                )}
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Logo />
      )}
    </div>
  );
}

FolderList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FolderList);
