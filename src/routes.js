// Digital Boarding React layouts
import Dashboard from "layouts/dashboard";
import SignIn from "layouts/authentication/sign-in";
import Registration from "layouts/registration";
import Eventsreports from "layouts/eventsreports";
import Financereports from "layouts/financereports";
import Events from "layouts/events";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ImageIcon from "@mui/icons-material/Image";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import CategoryIcon from "@mui/icons-material/Category";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StyleIcon from "@mui/icons-material/Style";
import Categories from "layouts/categories";
import Departments from "layouts/departments";
import Addevents from "layouts/addevents";
import EventRegistration from "layouts/eventregistration";
import HomeBanners from "layouts/homebanners/homeBanners";
// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <AssessmentIcon sx={{ fontSize: "30px !important" }} />,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Events",
    key: "events",
    icon: <LocalActivityIcon sx={{ fontSize: "30px !important" }} />,
    route: "/events",
    component: <Events />,
  },
  {
    type: "collapse",
    name: "Add Events",
    key: "addevents",
    icon: <EventSeatIcon sx={{ fontSize: "30px !important" }} />,
    route: "/addevents",
    component: <Addevents />,
  },
  {
    type: "collapse",
    name: "Categories",
    key: "categories",
    icon: <CategoryIcon sx={{ fontSize: "30px !important" }} />,
    route: "/categories",
    component: <Categories />,
  },
  {
    type: "collapse",
    name: "Home Banners",
    key: "homebanners",
    icon: <ImageIcon sx={{ fontSize: "30px !important" }} />,
    route: "/homebanners",
    component: <HomeBanners />,
  },
  {
    type: "collapse",
    name: "Event Registrations",
    key: "eventregistration",
    icon: <AssignmentTurnedInIcon sx={{ fontSize: "30px !important" }} />,
    route: "/eventregistration",
    component: <EventRegistration />,
  },
  {
    type: "collapse",
    name: "User Registrations",
    key: "registration",
    icon: <AssignmentIndIcon sx={{ fontSize: "26px !important" }} />,
    route: "/registration",
    component: <Registration />,
  },
  {
    type: "collapse",
    name: "Events Reports",
    key: "eventsreports",
    icon: <SwitchAccountIcon sx={{ fontSize: "26px !important" }} />,
    route: "/eventsreports",
    component: <Eventsreports />,
  },
  {
    type: "collapse",
    name: "Finance Reports",
    key: "financereports",
    icon: <VerifiedUserIcon sx={{ fontSize: "26px !important" }} />,
    route: "/financereports",
    component: <Financereports />,
  },
  // {
  //   type: "collapse",
  //   name: "Departments",
  //   key: "departments",
  //   icon: <StyleIcon sx={{ fontSize: "30px !important" }} />,
  //   route: "/departments",
  //   component: <Departments />,
  // },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
];

export default routes;
