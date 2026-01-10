import React from "react";
import "../styles/MobileBookingBar.css";

interface Props {
  price: number;
  onReserve: () => void;
}

const MobileBookingBar: React.FC<Props> = ({ price, onReserve }) => {
  return (
    <div className="mobile-booking-bar">
      <div>
        <span className="mobile-price">₹{price.toLocaleString()}</span>
        <span className="mobile-night"> / night</span>
      </div>

      <button className="mobile-reserve-btn" onClick={onReserve}>
        Reserve
      </button>
    </div>
  );
};

export default MobileBookingBar;
