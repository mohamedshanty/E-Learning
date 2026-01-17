import { TextField } from "@mui/material";
import { styled } from "@mui/system";

const CustomTextField = styled(TextField)(() => ({
  "& label": {
    color: "#AAAAAA",
  },
  "& label.Mui-focused": {
    color: "#AAAAAA",
  },
  "& .MuiOutlinedInput-root": {
    color: "#EEEEEE",
    "& fieldset": {
      borderColor: "#333",
    },
    "&:hover fieldset": {
      borderColor: "#00ADB5",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#00ADB5",
    },
  },
}));

export default CustomTextField;
