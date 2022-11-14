import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';
import SignupFormModal from '../SignupFormPage';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const [showDropdown, setShowDropdown] = useState(false)

  const display = () => {
    if(showDropdown) return 'show-dropdown'
    else return 'hide-dropdown'
  }

  const isDropdown = () => {
    if(showDropdown) setShowDropdown(false)
    else setShowDropdown(true)
  }


  useEffect(() => {
    if (!showDropdown) return

    const closeDropdown = () => {
        setShowDropdown(false);
    };

    document.addEventListener('click', closeDropdown);

    return () => document.removeEventListener("click", closeDropdown)
  }, [showDropdown])

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ProfileButton user={sessionUser} />
    );
  } else {
    sessionLinks = (
      <div>
      <button onClick={isDropdown}>Get Started</button>
        <div className={display()}>
        <LoginFormModal />
        <SignupFormModal />
        </div>
        {/* <NavLink to="/signup">Sign Up</NavLink> */}
      </div>
    );
  }

  return (
    <div className='entire-nav'>
    {/* <ul>
      <li> */}
        <NavLink exact to="/">Home</NavLink>
        {isLoaded && sessionLinks}
      {/* </li>
    </ul> */}
    </div>
  );
}

export default Navigation;