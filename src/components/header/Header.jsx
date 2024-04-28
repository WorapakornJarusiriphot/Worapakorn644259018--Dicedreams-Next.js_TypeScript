"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import DrawerMobileNavigation from "../DrawerMobileNavigation";
import Link from "next/link";

function Header() {
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  return (
    <div className="font-bold w-full fixed top-0">
      <AppBar position="fixed" sx={{ zIndex: 1500, background: "#FFFFFF" }}>  {/* ปรับค่า z-index ให้สูง */}
      {/* <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} sx={{ background: "#FFFFFF" }}> */}
        <Toolbar>
          {/* <IconButton
            size="medium"
            edge="start"
            color="black"
            aria-label="menu"
            onClick={handleDrawerOpen}
            sx={{ mr: 2 }}
          > */}
            <DrawerMobileNavigation handleDrawerOpen={handleDrawerOpen} />
          {/* </IconButton> */}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "left", color: "black" }}
          >
            <Link href="/" passHref>
            DiceDreams
            </Link>
          </Typography>
          <Button
            variant="contained"
            sx={{ background: "gray", color: "white", marginRight: "10px" }}
            href="/sign-up"
            replace="true"
          >
            สมัครสมาชิก
          </Button>
          <Button
            variant="contained"
            sx={{ background: "red", color: "white", marginRight: "10px" }}
            href="/sign-in"
            replace="true"
          >
            เข้าสู่ระบบ
          </Button>
          {/* <CircleNotificationsIcon sx={{ color: "black", size: "15" }} /> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
