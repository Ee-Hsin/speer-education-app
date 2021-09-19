import { UserMenu } from './UserMenu/UserMenu'
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone';
import PeopleTwoToneIcon from '@material-ui/icons/PeopleTwoTone';
import MessageTwoToneIcon from '@material-ui/icons/MessageTwoTone';
import { Link } from 'react-router-dom';
import history from '../../hooks/history';
import SearchBar from './SearchBar';


/**
 * Component for the link in the navbar
 * @component
 * @param {Component} IconComponent 
 * @param {string} title
 * @param {string} href
 * @returns 
 */
const NavBarLink = ({ IconComponent, title, href }) => {
  return <Link to={href} className="text-gray-800 no-underline flex-1 lg:flex-none">
    <div className="grid place-items-center h-full lg:px-5 hover:bg-gray-100 transition-colors cursor-pointer rounded-lg">
      <div className="flex-1 flex flex-col items-center">
        <IconComponent className="w-4 h-4 lg:h-8 lg:w-8" style={{ color: (href === history.location.pathname) ? '#F58A07' : '#084887' }} />
        <p className="text-xs text-center lg:text-base">{title}</p>
      </div>
    </div>
  </Link>
}

/**
 * App navbar shown to users
 * @component
 * @returns 
 */
const AppNavbar = () => {
  return (
    <div className="fixed bottom-0 lg:sticky lg:top-0 w-full h-14 lg:p-4 lg:h-24 bg-white z-10 shadow-md flex flex-row items-center justify-between">
      <img className="h-20 hidden lg:block cursor-pointer" src="/full-transparent-logo.png" alt="logo" onClick={() => history.push('/app')} />
      <div className="w-full lg:w-auto flex flex-row max-w-4xl justify-center items-center space-x-3">
        <SearchBar />
        <div className="flex flex-row h-full flex-1 lg:flex-none">
          <NavBarLink IconComponent={HomeTwoToneIcon} title="Home" href="/app" />
          <NavBarLink IconComponent={PeopleTwoToneIcon} title="New Mentors" href="/app/mentors" />
          <NavBarLink IconComponent={MessageTwoToneIcon} title="Contacts" href="/app/messages" />
          {/* <NavBarLink IconComponent={NotificationsTwoToneIcon} title="Notifications"/> */}
        </div>
        {/* <div className="hidden lg:block" >
          <Button variant="contained" color="primary" endIcon={<ArrowDropDownTwoToneIcon/>} style={{textTransform: "capitalize"}}>
            Compose a message
          </Button>
        </div> */}
        <UserMenu />
      </div>
      {/* Transparent image spcaer to center the stuff in the middle */}
      <img className="h-20 hidden lg:block opacity-0 cursor-pointer" src="/full-transparent-logo.png" alt="logo" onClick={() => history.push('/app')} />
    </div>
  );
};

export default AppNavbar;
