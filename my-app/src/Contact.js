import React from 'react';
import './App.css';
import './contact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import Font Awesome component
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'; // Import specific icons

function Contact() {
  return (
    <div className="container">
      <h1>Contact Us</h1>
      <p>
        <FontAwesomeIcon icon={faEnvelope} /> Email: sm019213@gmail.com
      </p>
      <p>
        <FontAwesomeIcon icon={faPhone} /> Phone: +92 331 2921133
      </p>
      <p>
        <FontAwesomeIcon icon={faMapMarkerAlt} /> Address: 123 Eye Scanner St., Vision City
      </p>
    </div>
  );
}

export default Contact;
