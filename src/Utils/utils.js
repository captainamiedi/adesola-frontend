import { useTheme } from '@mui/material/styles';
// import { useSelector, shallowEqual } from 'react-redux'
export const useThemeMode = () => {
    // const orgInfo = useSelector(
    //   (state) => state.orgInfo.responseData,
    //   shallowEqual
    // );
    const theme = useTheme();
    if (theme.palette.type === "dark")
      return {
        isDarkMode: true,
        themeColor: "#fff",
      };
    else
      return {
        isDarkMode: false,
        theme: '#1A2038'
        // themeColor: `${orgInfo?.colorThemes[1].primary}`,
      };
  };