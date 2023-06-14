import React, { useState } from "react";
import {Box, Button} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useThemeMode } from "../Utils/utils";
import { Link, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const initialState = {
    email: "",
    password: "",
    first_name: '',
    last_name: '',
    phone_number: '',
};

const supabase = createClient(process.env.REACT_APP_Project_URL, process.env.REACT_APP_Public_Anon_Key)

export default function Signup() {
    const [userInfo, setUserInfo] = useState(initialState);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false)

    // const {loading} = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const handleSubmit =async () => {
      const { email, password } = userInfo;
      // console.log(email, password);
      setLoading(true)
      delete userInfo.email
      delete userInfo.password

      const { data, error } = await supabase.auth.signUp(
        {
          email,
          password,
          options: userInfo
        }
      )

      setLoading(true)
      navigate('/')
  
    };
    const handleVisibility = () => {
      if (!visible) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    const handleChange = ({ target: { name, value } }) => {
      let temp = { ...userInfo };
      temp[name] = value;
      setUserInfo(temp);
    };
    const { themeColor } = useThemeMode()
  return (
    <div style={{ backgroundColor: "#1A2038" }} className="h-screen	flex justify-center">
    <Box
      className="flex justify-center items-center  min-h-full-screen"
      sx={{ margin: 'auto 0' }}
    >
      <Card sx={{ width: {md: 500, sm: '100%'}, margin: "1rem", padding: '1.5rem' }}>
        <Grid container>
          <Grid item lg md sm xs>
            {/* <Box
              className="flex items-center justify-between px-8 pt-8"
              sx={{ columnGap: "4rem" }}
            >
              <img
                src='https://dev.churchpad.com/xMasterPortalLogosLoc/app_pdf_logos/app_250_1652976260_t0n9uo_my.png'
                alt=""
                style={{ width: "5rem" }}
              />
              <span>
                <h3 style={{ color: `${themeColor}` }}>Adesola Chat Portal</h3>
              </span>
            </Box> */}
            <div className="px-8 mt-5 pb-8">
              <h6 style={{ color: `${themeColor}` }} className=" text-center pb-4">
                Adesola Chat
              </h6>
              <Divider />
            </div>
            <ValidatorForm action="" onSubmit={handleSubmit}>
              <div className="mb-3 w-full">
                <TextValidator
                  
                  variant="outlined"
                  size="small"
                  label="First Name"
                  onChange={handleChange}
                  type="text"
                  name="first_name"
                  value={userInfo.first_name}
                  fullWidth
                  validators={["required"]}
                  errorMessages={["this field is required", "first name is not valid"]}
                />

              </div>
              <div className="mb-3 w-full">
                <TextValidator
                  
                  variant="outlined"
                  size="small"
                  label="Last Name"
                  onChange={handleChange}
                  type="text"
                  name="last_name"
                  value={userInfo.last_name}
                  fullWidth
                  validators={["required"]}
                  errorMessages={["this field is required", "last name is not valid"]}
                />
              </div>
              <div className="mb-3 w-full">
                <TextValidator
                  
                  variant="outlined"
                  size="small"
                  label="Email"
                  onChange={handleChange}
                  type="email"
                  name="email"
                  value={userInfo.email}
                  fullWidth
                  validators={["required", 'isEmail']}
                  errorMessages={["this field is required", "Email is not valid"]}
                />
              </div>
              <div className="mb-3 w-full">
                <TextValidator
                  
                  variant="outlined"
                  size="small"
                  label="Phone Number"
                  onChange={handleChange}
                  type="tel"
                  name="phone_number"
                  value={userInfo.phone_number}
                  fullWidth
                  validators={["required"]}
                  errorMessages={["this field is required", "Phone Number is not valid"]}
                />
              </div>
              <div className="mb-3 w-full">
                <TextValidator
                  className="mb-3 w-full"
                  label="Password"
                  variant="outlined"
                  size="small"
                  onChange={handleChange}
                  name="password"
                  fullWidth
                  type={visible ? "text" : "password"}
                  value={userInfo.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleVisibility}
                          aria-label="Toggle password visibility"
                        >
                          {!visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div
                  className="flex justify-between items-center mb-4 mt-4"
                  style={{ columnGap: "2rem" }}
                >
                  <div className="relative w-full">
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      type="submit"
                      className="w-full capitalize"
                      sx={{textTransform: 'capitalize'}}
                    >
                      {loading ? 'Loading...' : 'Sign up'}
                    </Button>
                    {/* {loading && (
                      <CircularProgress
                        size={24}
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          marginTop: -12,
                          marginLeft: -12,
                        }}
                      />
                    )} */}
                  </div>
                  </div>
            </ValidatorForm>
          </Grid>
        </Grid>
        <div className='flex'>
          <p className='pr-4'>Already have account?</p>
            <Link to='/'>Login</Link>
        </div>
      </Card>
    </Box>
  </div>
  )
}
