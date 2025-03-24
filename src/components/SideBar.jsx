import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';

import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Home as MuiHome,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    ContactsOutlined as ContactsOutlinedIcon,
    PersonOutlined as PersonOutlinedIcon,
    CalendarTodayOutlined as CalendarTodayOutlinedIcon,
    BarChartOutlined as BarChartOutlinedIcon,
    PieChartOutlineOutlined as PieChartOutlineOutlinedIcon,
    TimelineOutlined as TimelineOutlinedIcon,
    MapOutlined as MapOutlinedIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

import logo from '../assets/img/logo-site.png'




export const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
    // @ts-ignore
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    '& .MuiDrawer-paper': {
        backgroundColor: theme.palette.background.paper,
    },
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),

    ...theme.mixins.toolbar,
}));

const Array1 = [
    { text: 'Dashboard', icon: <MuiHome />, path: '/dashboard' },
    { text: "Contacts ", icon: <ContactsOutlinedIcon />, path: "/contacts" },
];

const Array2 = [
    { text: "Profile ", icon: <PersonOutlinedIcon />, path: "/form" },
    { text: "Calendar", icon: <CalendarTodayOutlinedIcon />, path: "/calendar" },


];

const Array3 = [
    { text: "Bar Chart", icon: <BarChartOutlinedIcon />, path: "/bar" },
    { text: "Pie Chart", icon: <PieChartOutlineOutlinedIcon />, path: "/pie" },
    { text: "Line Chart", icon: <TimelineOutlinedIcon />, path: "/line" },
    { text: "Geography Chart", icon: <MapOutlinedIcon />, path: "/geography" },
];

export default function SideBar({ open, handleDrawerClose }) {
    let location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    return (
        <Drawer variant="permanent" open={open}>
            <Link to="/">
                <div className="flex justify-center p-4">
                    <img src={logo} className="w-full h-20 object-contain" alt="Logo" />
                </div>
            </Link>
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === "rtl" ? (
                        <ChevronRightIcon />
                    ) : (
                        <ChevronLeftIcon />
                    )}
                </IconButton>
            </DrawerHeader>
            <Divider />



            <List>
                {Array1.map((item) => (
                    <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
                        <Tooltip title={open ? null : item.text} placement="left">
                            <ListItemButton
                                onClick={() => {
                                    navigate(item.path);
                                }}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,

                                    bgcolor: location.pathname === item.path
                                        ? theme.palette.mode === "dark"
                                            ? grey[800]
                                            : grey[300]
                                        : null,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>

            <Divider />

            <List>
                {Array2.map((item) => (
                    <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
                        <Tooltip title={open ? null : item.text} placement="left">
                            <ListItemButton
                                onClick={() => {
                                    navigate(item.path);
                                }}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                    bgcolor:
                                        location.pathname === item.path
                                            ? theme.palette.mode === "dark"
                                                ? grey[800]
                                                : grey[300]
                                            : null,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>


            <Divider />

            <List>
                {Array3.map((item) => (
                    <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
                        <Tooltip title={open ? null : item.text} placement="left">
                            <ListItemButton
                                onClick={() => {
                                    navigate(item.path);
                                }}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                    bgcolor:
                                        location.pathname === item.path
                                            ? theme.palette.mode === "dark"
                                                ? grey[800]
                                                : grey[300]
                                            : null,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>

        </Drawer>
    )
}


