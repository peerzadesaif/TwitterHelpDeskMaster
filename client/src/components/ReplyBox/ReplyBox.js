import React from "react";
import { Button, Divider, TextField } from "@material-ui/core";

function ReplyBox(props) {
  let { reply, handleInputChange, postReplies, replyButtonDisabled } = props;
  return (
    <React.Fragment>
      <TextField
        id="outlined-full-width"
        name="reply"
        // fullWidth
        multiline
        rows="1"
        value={reply}
        onChange={handleInputChange}
        variant={"outlined"}
        style={{ backgroundColor: "white", width: '85%' }}
        InputProps={{
          placeholder: 'Reply...',
          endAdornment: (
            <Button
              disabled={replyButtonDisabled}
              className="reply"
              color="primary"
              variant="contained"
              style={{ borderRadius: "10%" }}
              onClick={postReplies}
            >
              Reply
            </Button>
          )
        }}
      ></TextField>
    </React.Fragment>

  );
}

export default ReplyBox