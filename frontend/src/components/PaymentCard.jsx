import React from 'react';
import styled from 'styled-components';

const PaymentCard = ({ onClick }) => {
  return (
    <StyledWrapper onClick={onClick}>
      <div className="container">
        <div className="left-side">
          <div className="card">
            <div className="card-line" />
            <div className="buttons" />
          </div>
          <div className="post">
            <div className="post-line" />
            <div className="screen">
              <div className="dollar">$</div>
            </div>
            <div className="numbers" />
            <div className="numbers-line2" />
          </div>
        </div>
        <div className="right-side">
          <div className="new">Complete Payment</div>
          <svg viewBox="0 0 451.846 451.847" height={512} width={512} xmlns="http://www.w3.org/2000/svg" className="arrow"><path fill="#cfcfcf" data-old_color="#000000" className="active-path" data-original="#000000" d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z" /></svg>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    background-color: #ffffff;
    display: flex;
    width: 300px;
    height: 80px;
    position: relative;
    border-radius: 6px;
    transition: 0.3s ease-in-out;
  }

  .container:hover {
    transform: scale(1.03);
    width: 150px;
  }

  .container:hover .left-side {
    width: 100%;
  }

  .left-side {
    background-color: #5de2a3;
    width: 80px;
    height: 80px;
    border-radius: 4px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.3s;
    flex-shrink: 0;
    overflow: hidden;
  }

  .right-side {
    width: calc(100% - 80px);
    display: flex;
    align-items: center;
    overflow: hidden;
    cursor: pointer;
    justify-content: space-between;
    white-space: nowrap;
    transition: 0.3s;
  }

  .right-side:hover {
    background-color: #f9f7f9;
  }

  .arrow {
    width: 16px;
    height: 16px;
    margin-right: 15px;
  }

  .new {
    font-size: 16px;
    font-family: "Lexend Deca", sans-serif;
    margin-left: 15px;
  }

  .card {
    width: 45px;
    height: 30px;
    background-color: #c7ffbc;
    border-radius: 4px;
    position: absolute;
    display: flex;
    z-index: 10;
    flex-direction: column;
    align-items: center;
    -webkit-box-shadow: 6px 6px 6px -2px rgba(77, 200, 143, 0.72);
    -moz-box-shadow: 6px 6px 6px -2px rgba(77, 200, 143, 0.72);
    -webkit-box-shadow: 6px 6px 6px -2px rgba(77, 200, 143, 0.72);
  }

  .card-line {
    width: 40px;
    height: 8px;
    background-color: #80ea69;
    border-radius: 2px;
    margin-top: 5px;
  }

  @media only screen and (max-width: 480px) {
    .container {
      transform: scale(0.7);
    }

    .container:hover {
      transform: scale(0.74);
    }

    .new {
      font-size: 14px;
    }
  }

  .buttons {
    width: 6px;
    height: 6px;
    background-color: #379e1f;
    box-shadow: 0 -8px 0 0 #26850e, 0 8px 0 0 #56be3e;
    border-radius: 50%;
    margin-top: 3px;
    transform: rotate(90deg);
    margin: 8px 0 0 -20px;
  }

  .container:hover .card {
    animation: slide-top 1.2s cubic-bezier(0.645, 0.045, 0.355, 1) both;
  }

  .container:hover .post {
    animation: slide-post 1s cubic-bezier(0.165, 0.84, 0.44, 1) both;
  }

  @keyframes slide-top {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }

    50% {
      -webkit-transform: translateY(-50px) rotate(90deg);
      transform: translateY(-50px) rotate(90deg);
    }

    60% {
      -webkit-transform: translateY(-50px) rotate(90deg);
      transform: translateY(-50px) rotate(90deg);
    }

    100% {
      -webkit-transform: translateY(-6px) rotate(90deg);
      transform: translateY(-6px) rotate(90deg);
    }
  }

  .post {
    width: 40px;
    height: 50px;
    background-color: #dddde0;
    position: absolute;
    z-index: 11;
    bottom: 8px;
    top: 80px;
    border-radius: 4px;
    overflow: hidden;
  }

  .post-line {
    width: 30px;
    height: 6px;
    background-color: #545354;
    position: absolute;
    border-radius: 0px 0px 2px 2px;
    right: 5px;
    top: 5px;
  }

  .post-line:before {
    content: "";
    position: absolute;
    width: 30px;
    height: 6px;
    background-color: #757375;
    top: -6px;
  }

  .screen {
    width: 30px;
    height: 15px;
    background-color: #ffffff;
    position: absolute;
    top: 15px;
    right: 5px;
    border-radius: 2px;
  }

  .numbers {
    width: 8px;
    height: 8px;
    background-color: #838183;
    box-shadow: 0 -12px 0 0 #838183, 0 12px 0 0 #838183;
    border-radius: 2px;
    position: absolute;
    transform: rotate(90deg);
    left: 16px;
    top: 35px;
  }

  .numbers-line2 {
    width: 8px;
    height: 8px;
    background-color: #aaa9ab;
    box-shadow: 0 -12px 0 0 #aaa9ab, 0 12px 0 0 #aaa9ab;
    border-radius: 2px;
    position: absolute;
    transform: rotate(90deg);
    left: 16px;
    top: 45px;
  }

  @keyframes slide-post {
    50% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }

    100% {
      -webkit-transform: translateY(-50px);
      transform: translateY(-50px);
    }
  }

  .dollar {
    position: absolute;
    font-size: 12px;
    font-family: "Lexend Deca", sans-serif;
    width: 100%;
    left: 0;
    top: 0;
    color: #4b953b;
    text-align: center;
  }

  .container:hover .dollar {
    animation: fade-in-fwd 0.3s 1s backwards;
  }

  @keyframes fade-in-fwd {
    0% {
      opacity: 0;
      transform: translateY(-5px);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default PaymentCard; 