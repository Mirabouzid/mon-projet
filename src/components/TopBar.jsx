import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import {
    Box,
    IconButton,
    InputBase,
    Stack,
    Toolbar, useTheme
} from "@mui/material";
import {
    Menu,
    Search as SearchIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    Notifications as NotificationsIcon,
    Settings as SettingsIcon,
    Person,
} from '@mui/icons-material';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const StyledSearch = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));

export default function TopBar({
    open,
    handleDrawerOpen,
    setMode,
    mode,
    searchQuery = "",
    onSearch = () => { }
}) {
    const theme = useTheme();

    const toggleTheme = () => {
        setMode(prev => {
            const newMode = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem("currentMode", newMode);
            return newMode;
        });
    };

    const handleSearchChange = (event) => {
        onSearch(event.target.value);
    };

    return (
        <AppBar position="fixed" open={open}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{
                        mr: 2,
                        ...(open && { display: "none" }),
                    }}
                >
                    <Menu />
                </IconButton>

                <StyledSearch>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ "aria-label": "search" }}
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </StyledSearch>

                <Box sx={{ flexGrow: 1 }} />

                <Stack direction="row" spacing={1}>
                    <IconButton
                        onClick={toggleTheme}
                        color="inherit"
                    >
                        {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>

                    <IconButton color="inherit">
                        <NotificationsIcon />
                    </IconButton>

                    <IconButton color="inherit">
                        <SettingsIcon />
                    </IconButton>

                    <IconButton color="inherit">
                        <Person />
                    </IconButton>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}