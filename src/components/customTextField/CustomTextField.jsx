import { TextField } from "@mui/material";
import { styled } from "@mui/system";

const CustomTextField = styled(TextField)(() => ({
  "& label": {
    color: "#bbb",
  },
  "& label.Mui-focused": {
    color: "#ccc",
  },
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    "& fieldset": {
      borderColor: "#555",
    },
    "&:hover fieldset": {
      borderColor: "#888",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2c5364",
    },
  },
}));

export default CustomTextField;
