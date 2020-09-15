import React from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  makeStyles
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import InfoCard from "./InfoCard";


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));


function InfoColumn(props) {
  const { selectedTweet } = props;
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const classes = useStyles();
  return (
    <Paper
      className="remove-box-shadow"
      elevation={0}
      style={{
        height: "89vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {selectedTweet && (
        <div style={{ width: "100%" }}>
          <InfoCard selectedTweet={selectedTweet} />

          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography>Task</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List className={classes.root}>
                {[0, 1].map((value) => {
                  const labelId = `checkbox-list-label-${value}`;

                  return (
                    <ListItem key={`${value}_checkbox`} role={undefined} dense button >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                    </ListItem>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>


        </div>
      )}
    </Paper>
  );
}


export default InfoColumn