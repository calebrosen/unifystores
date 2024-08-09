import { faHouse, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

function HomeAndLogOutButtons({ children }) {

function logout() {
    //removing login token
    localStorage.removeItem('token');
    //refreshing to have user kicked back to login screen
    location.reload();
}

function goToHomepage() {
    location.href = '/dashboard';
}

    return (
        <div>
            <span className='topRightIcons'>
                <a onClick={goToHomepage}><FontAwesomeIcon icon={faHouse} /> Home</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} /> Logout</a>
            </span>
            {children}
        </div>
    );
}

export default HomeAndLogOutButtons;
