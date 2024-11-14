import React from 'react';
import DeliverForm from './components/DeliverForm';
import Mymap from './components/Mymap';
import './index.less';

const HomePage: React.FC = () => {
  return (
    <div className="container">
      <Mymap />
      <div className="deliver-form">
        <DeliverForm />
      </div>
    </div>
  );
};

export default HomePage;
