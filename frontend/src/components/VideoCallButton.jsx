import React from 'react';
import styled from 'styled-components';

const VideoCallButton = ({ onClick, label = 'Start Video Call' }) => {
  return (
    <StyledWrapper>
      <button onClick={onClick}>
        <div className="svg-wrapper-1">
          <div className="svg-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18}>
              <path fill="none" d="M0 0h24v24H0z" />
              <path fill="currentColor" d="M17 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l4 4v-11l-4 4z" />
            </svg>
          </div>
        </div>
        <span>{label}</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    font-family: inherit;
    font-size: 13px;
    background: #22c55e; /* Modern green */
    color: white;
    padding: 0.35em 0.9em;
    padding-left: 0.7em;
    display: flex;
    align-items: center;
    border: none;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s;
    cursor: pointer;
    min-width: 120px;
    position: relative;
  }

  button span {
    display: block;
    margin-left: 0.25em;
    transition: all 0.3s ease-in-out;
    white-space: nowrap;
  }

  button svg {
    display: block;
    transform-origin: center center;
    transition: transform 0.3s ease-in-out;
  }

  button:hover .svg-wrapper {
    animation: fly-1 0.6s ease-in-out infinite alternate;
  }

  button:hover svg {
    transform: translateX(0.5em) rotate(20deg) scale(1.08);
  }

  button:hover span {
    transform: translateX(1.2em);
    opacity: 1;
  }

  button:active {
    transform: scale(0.95);
  }

  @keyframes fly-1 {
    from {
      transform: translateY(0.1em);
    }

    to {
      transform: translateY(-0.1em);
    }
  }
`;

export default VideoCallButton; 