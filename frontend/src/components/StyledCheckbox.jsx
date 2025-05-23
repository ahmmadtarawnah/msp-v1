import React from 'react';
import styled from 'styled-components';

const StyledCheckbox = ({ id, checked, onChange }) => {
  return (
    <StyledWrapper>
      <div className="checkbox-wrapper">
        <input 
          id={id} 
          type="radio" 
          name="consultation-rate"
          checked={checked}
          onChange={onChange}
        />
        <label htmlFor={id}>
          <div className="tick_mark" />
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .checkbox-wrapper * {
    -webkit-tap-highlight-color: transparent;
    outline: none;
  }

  .checkbox-wrapper input[type="radio"] {
    display: none;
  }

  .checkbox-wrapper label {
    --size: 35px;
    --shadow: calc(var(--size) * .07) calc(var(--size) * .1);
    position: relative;
    display: block;
    width: var(--size);
    height: var(--size);
    margin: 0 auto;
    background-color: #2B3B3A;
    background-image: linear-gradient(43deg, #2B3B3A 0%, #1A2A29 46%, #DECEB0 100%);
    border-radius: 50%;
    box-shadow: 0 var(--shadow) rgba(43, 59, 58, 0.3);
    cursor: pointer;
    transition: 0.2s ease transform, 0.2s ease background-color,
        0.2s ease box-shadow;
    overflow: hidden;
    z-index: 1;
  }

  .checkbox-wrapper label:before {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    width: calc(var(--size) * .7);
    height: calc(var(--size) * .7);
    margin: 0 auto;
    background-color: #fff;
    transform: translateY(-50%);
    border-radius: 50%;
    box-shadow: inset 0 var(--shadow) rgba(43, 59, 58, 0.2);
    transition: 0.2s ease width, 0.2s ease height;
  }

  .checkbox-wrapper label:hover:before {
    width: calc(var(--size) * .55);
    height: calc(var(--size) * .55);
    box-shadow: inset 0 var(--shadow) rgba(43, 59, 58, 0.3);
  }

  .checkbox-wrapper label:active {
    transform: scale(0.9);
  }

  .checkbox-wrapper .tick_mark {
    position: absolute;
    top: -1px;
    right: 0;
    left: calc(var(--size) * -.05);
    width: calc(var(--size) * .6);
    height: calc(var(--size) * .6);
    margin: 0 auto;
    margin-left: calc(var(--size) * .14);
    transform: rotateZ(-40deg);
  }

  .checkbox-wrapper .tick_mark:before,
  .checkbox-wrapper .tick_mark:after {
    content: "";
    position: absolute;
    background-color: #fff;
    border-radius: 2px;
    opacity: 0;
    transition: 0.2s ease transform, 0.2s ease opacity;
  }

  .checkbox-wrapper .tick_mark:before {
    left: 0;
    bottom: 0;
    width: calc(var(--size) * .1);
    height: calc(var(--size) * .3);
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.23);
    transform: translateY(calc(var(--size) * -.68));
  }

  .checkbox-wrapper .tick_mark:after {
    left: 0;
    bottom: 0;
    width: 100%;
    height: calc(var(--size) * .1);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.23);
    transform: translateX(calc(var(--size) * .78));
  }

  .checkbox-wrapper input[type="radio"]:checked + label {
    background-color: #2B3B3A;
    background-image: linear-gradient(43deg, #2B3B3A 0%, #1A2A29 46%, #DECEB0 100%);
    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
  }

  .checkbox-wrapper input[type="radio"]:checked + label:before {
    width: 0;
    height: 0;
  }

  .checkbox-wrapper input[type="radio"]:checked + label .tick_mark:before,
  .checkbox-wrapper input[type="radio"]:checked + label .tick_mark:after {
    transform: translate(0);
    opacity: 1;
  }
`;

export default StyledCheckbox; 