import { faArrowLeft, faHouse, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

function HomeAndLogOutButtons({ children }) {

function logout() {
    //removing login token
    localStorage.removeItem('token');
    //refreshing to have user kicked back to login screen
    location.reload();
}

const goBack = () => {
    history.back();
}

function goToHomepage() {
    location.href = '/dashboard';
}

    return (
        <div className="transition-all duration-300 transform sticky top-[1.25%] left-[1.38%]">
            <span className='bg-slate-700 text-white border-neutral-600 py-2.5 px-3 border-1 rounded-lg text-2xl'>
                <a onClick={goToHomepage} className="cursor-pointer hover:no-underline hover:text-cyan-500"><FontAwesomeIcon icon={faHouse} /> Home</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a onClick={goBack} className="cursor-pointer hover:no-underline hover:text-cyan-500"><FontAwesomeIcon icon={faArrowLeft} /> Back</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a onClick={logout} className="cursor-pointer hover:no-underline hover:text-cyan-500"><FontAwesomeIcon icon={faRightFromBracket} /> Logout</a>
            </span>
            {children}
        </div>
    );
}

export default HomeAndLogOutButtons;
