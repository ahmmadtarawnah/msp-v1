import React, { useState, useEffect } from "react";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [buttonPosition, setButtonPosition] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);

  // Function to handle button position shifting
  const shiftButton = () => {
    const isEmpty = username === "" || password === "";
    if (isEmpty) {
      const positions = [
        "shift-left",
        "shift-top",
        "shift-right",
        "shift-bottom",
      ];
      const currentPosition = positions.find((dir) => buttonPosition === dir);
      const nextPosition =
        positions[
          (positions.indexOf(currentPosition) + 1) % positions.length
        ] || positions[0];
      setButtonPosition(nextPosition);
      showMsg();
    }
  };

  // Function to show validation message
  const showMsg = () => {
    const isEmpty = username === "" || password === "";

    if (isEmpty) {
      setButtonDisabled(true);
      setMessage("Please fill the input fields before proceeding");
    } else {
      setMessage("Great! Now you can proceed");
      setButtonDisabled(false);
      setButtonPosition("no-shift");
    }
  };

  // Handle input changes
  useEffect(() => {
    showMsg();
  }, [username, password]);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center font-sans"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/7876051/pexels-photo-7876051.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="w-[400px] h-[480px] relative grid">
        {/* User icon */}
        <div className="absolute w-[85px] h-[85px] grid place-content-center text-[50px] border border-[#DECEB0] z-10 justify-self-center rounded-full bg-[#2B3B3A] text-[#DECEB0]">
          <i className="fa fa-user"></i>
        </div>

        {/* Form */}
        <form className="flex flex-col items-center justify-center p-[25px] h-[440px] rounded-[30px] bg-[#2B3B3A] border border-[#DECEB0]/20 absolute w-full bottom-0 shadow-lg">
          {/* Title */}
          <div className="relative my-[40px] text-[24px] font-bold text-[#DECEB0]">
            LOGIN
          </div>

          {/* Message */}
          <div
            className="absolute top-1/4 text-center"
            style={{
              color: username === "" || password === "" ? "#fa2929" : "#92ff92",
            }}
          >
            {message}
          </div>

          {/* Username field */}
          <div className="relative w-full mb-5">
            <input
              type="text"
              placeholder="Username"
              id="uname"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block outline-none w-full border-none text-[16px] text-[#DECEB0] mt-[25px] mb-[5px] caret-[#DECEB0] bg-transparent pb-[3px] border-b border-b-[#DECEB0]/50"
            />
            <i className="fa fa-user absolute text-[14px] right-[10px] bottom-[10px] text-[#DECEB0]"></i>
          </div>

          {/* Password field */}
          <div className="relative w-full mb-5">
            <input
              type="password"
              placeholder="Password"
              id="pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block outline-none w-full border-none text-[16px] text-[#DECEB0] mt-[25px] mb-[5px] caret-[#DECEB0] bg-transparent pb-[3px] border-b border-b-[#DECEB0]/50"
            />
            <i className="fa fa-lock absolute text-[14px] right-[10px] bottom-[10px] text-[#DECEB0]"></i>
          </div>

          {/* Remember me and Forget Password */}
          <div className="flex justify-between items-center w-full text-[14px] mb-5">
            <label
              htmlFor="remember"
              className="flex items-center cursor-pointer text-[#DECEB0]/80"
            >
              <input
                type="checkbox"
                id="remember"
                className="mr-2 cursor-pointer"
              />
              Remember me
            </label>
            <a
              href="#"
              className="no-underline text-[#DECEB0]/80 hover:text-[#DECEB0]"
            >
              Forget Password?
            </a>
          </div>

          {/* Button container */}
          <div
            className="p-[20px] transition-all duration-200 w-full"
            onMouseOver={shiftButton}
          >
            <button
              type="submit"
              disabled={buttonDisabled}
              onMouseOver={shiftButton}
              className={`w-full p-[8px_16px] border-none bg-[#DECEB0] text-[#2B3B3A] font-bold text-[14px] rounded-[12px] transition-all duration-300 hover:opacity-90 mx-auto ${
                buttonPosition === "shift-left"
                  ? "-translate-x-full"
                  : buttonPosition === "shift-top"
                  ? "-translate-y-full"
                  : buttonPosition === "shift-right"
                  ? "translate-x-full"
                  : buttonPosition === "shift-bottom"
                  ? "translate-y-full"
                  : "translate-x-0 translate-y-0"
              }`}
            >
              Login
            </button>   
          </div>

          {/* Sign up link */}
          <div className="text-[#DECEB0]/70 mt-[10px]">
            Don't have an Account?
            <a
              href="/Signup"
              className="no-underline text-[#DECEB0] ml-1 hover:underline"
            >
              Sign up
            </a>
          </div>
        </form>
      </div>

      {/* Include Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
    </div>
  );
};

export default LoginForm;
