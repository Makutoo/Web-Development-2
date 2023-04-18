import React from 'react';
import '../App.css';

const Home = () => {
  return (
    <div>
      <p className='hometext'>
        Don't Miss Events Near Woodbridge Township!
      </p>
      <p className='hometext'>
        Premium Tickets On Sale Now And Selling Fast!
      </p>
      <p className='hometext'>
        Browse Full Selection of Concerts, Sports & Theater Tickets!
      </p>
      <p className='hometext'>
        The application is using {' '} 
        <a
          rel='noopener noreferrer'
          target='_blank'
          href='https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/'
        >
        TicketMaster API
        </a>{' '}
      </p>
    </div>
  );
};

export default Home;