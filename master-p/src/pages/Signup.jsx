import React, { useState } from "react";

const Signup = () => {
  // State to toggle between user and lawyer forms
  const [formType, setFormType] = useState("user"); // "user" or "lawyer"

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center font-sans relative"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/7876051/pexels-photo-7876051.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
      }}
    >
      {/* Fixed position overlay with z-index to ensure it's behind the form */}
      <div className="fixed inset-0 bg-black opacity-80 z-0"></div>

      {/* Increased max-width from max-w-md to max-w-2xl for a wider form */}
      <div className="w-full max-w-2xl px-4 relative z-10">
        {/* Form selection tabs */}
        <div className="flex justify-center -mb-4 z-10 relative">
          <button
            onClick={() => setFormType("user")}
            className={`px-8 py-2 rounded-t-lg transition-all duration-300 ${
              formType === "user"
                ? "bg-[#2B3B3A] text-[#DECEB0] font-bold"
                : "bg-[#1a2625] text-[#DECEB0]/70"
            }`}
          >
            User Signup
          </button>
          <button
            onClick={() => setFormType("lawyer")}
            className={`px-8 py-2 rounded-t-lg ml-2 transition-all duration-300 ${
              formType === "lawyer"
                ? "bg-[#2B3B3A] text-[#DECEB0] font-bold"
                : "bg-[#1a2625] text-[#DECEB0]/70"
            }`}
          >
            Lawyer Signup
          </button>
        </div>

        {formType === "user" ? <UserForm /> : <LawyerForm />}
      </div>

      {/* Include Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
    </div>
  );
};

// User Signup Form Component
const UserForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState("");

  // Form validation
  const isFormValid =
    fullName &&
    email &&
    username &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    termsAccepted;

  // Update message based on validation
  const validateForm = () => {
    if (!fullName || !email || !username || !password || !confirmPassword) {
      setMessage("Please fill all required fields");
      return false;
    } else if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return false;
    } else if (!termsAccepted) {
      setMessage("Accept Terms & Privacy Policy");
      return false;
    } else {
      setMessage("Ready to proceed!");
      return true;
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("User form submitted", {
        fullName,
        email,
        username,
        password,
      });
      // Submit logic would go here
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center p-8 rounded-lg bg-[#2B3B3A] border border-[#DECEB0]/20 shadow-lg transition-all duration-300"
    >
      {/* User icon */}
      <div className="w-20 h-20 grid place-content-center text-4xl border border-[#DECEB0] rounded-full bg-[#2B3B3A] text-[#DECEB0] mb-6">
        <i className="fa fa-user"></i>
      </div>

      {/* Title */}
      <div className="text-2xl font-bold text-[#DECEB0] mb-3">USER SIGNUP</div>

      {/* Message */}
      <div
        className="text-center text-sm h-5 mb-6"
        style={{
          color: isFormValid ? "#92ff92" : "#fa2929",
        }}
      >
        {message}
      </div>

      <div className="w-full grid grid-cols-1 gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name field */}
          <div className="relative w-full">
            <div className="text-sm text-[#DECEB0]/80 mb-1">Full Name</div>
            <div className="relative flex items-center">
              <i className="fa fa-user absolute text-sm left-3 text-[#DECEB0]"></i>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block outline-none w-full rounded-md border border-[#DECEB0]/30 text-sm px-10 py-3 text-[#DECEB0] caret-[#DECEB0] bg-[#22302f] focus:border-[#DECEB0]/70"
              />
            </div>
          </div>

          {/* Email field */}
          <div className="relative w-full">
            <div className="text-sm text-[#DECEB0]/80 mb-1">Email Address</div>
            <div className="relative flex items-center">
              <i className="fa fa-envelope absolute text-sm left-3 text-[#DECEB0]"></i>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block outline-none w-full rounded-md border border-[#DECEB0]/30 text-sm px-10 py-3 text-[#DECEB0] caret-[#DECEB0] bg-[#22302f] focus:border-[#DECEB0]/70"
              />
            </div>
          </div>
        </div>

        {/* Username field */}
        <div className="relative w-full">
          <div className="text-sm text-[#DECEB0]/80 mb-1">Username</div>
          <div className="relative flex items-center">
            <i className="fa fa-id-card absolute text-sm left-3 text-[#DECEB0]"></i>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block outline-none w-full rounded-md border border-[#DECEB0]/30 text-sm px-10 py-3 text-[#DECEB0] caret-[#DECEB0] bg-[#22302f] focus:border-[#DECEB0]/70"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Password field */}
          <div className="relative w-full">
            <div className="text-sm text-[#DECEB0]/80 mb-1">Password</div>
            <div className="relative flex items-center">
              <i className="fa fa-lock absolute text-sm left-3 text-[#DECEB0]"></i>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block outline-none w-full rounded-md border border-[#DECEB0]/30 text-sm px-10 py-3 text-[#DECEB0] caret-[#DECEB0] bg-[#22302f] focus:border-[#DECEB0]/70"
              />
            </div>
          </div>

          {/* Confirm Password field */}
          <div className="relative w-full">
            <div className="text-sm text-[#DECEB0]/80 mb-1">
              Confirm Password
            </div>
            <div className="relative flex items-center">
              <i className="fa fa-check-circle absolute text-sm left-3 text-[#DECEB0]"></i>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block outline-none w-full rounded-md border border-[#DECEB0]/30 text-sm px-10 py-3 text-[#DECEB0] caret-[#DECEB0] bg-[#22302f] focus:border-[#DECEB0]/70"
              />
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="text-sm mt-3">
          <label
            htmlFor="user-terms"
            className="flex items-center cursor-pointer text-[#DECEB0]/80"
          >
            <input
              type="checkbox"
              id="user-terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mr-2 cursor-pointer h-5 w-5"
            />
            I agree to the{" "}
            <a href="#" className="mx-1 text-[#DECEB0] hover:underline">
              Terms
            </a>{" "}
            &{" "}
            <a href="#" className="ml-1 text-[#DECEB0] hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!isFormValid}
        className={`px-8 py-3 mt-8 border-none bg-[#DECEB0] text-[#2B3B3A] font-bold text-base rounded-md transition-all duration-300 hover:opacity-90 w-1/2 ${
          !isFormValid ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Create Account
      </button>

      {/* Login link */}
      <div className="text-[#DECEB0]/70 text-sm mt-5">
        Already have an Account?
        <a
          href="/Login"
          className="no-underline text-[#DECEB0] ml-1 hover:underline"
        >
          Login
        </a>
      </div>
    </form>
  );
};

// Lawyer Signup Form Component
const LawyerForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [barNumber, setBarNumber] = useState("");
  const [practiceArea, setPracticeArea] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState("");

  // Practice area options
  const practiceAreas = [
    "Corporate Law",
    "Criminal Law",
    "Family Law",
    "Intellectual Property",
    "Real Estate",
    "Tax Law",
    "Immigration Law",
    "Personal Injury",
    "Employment Law",
    "Other",
  ];

  // Form validation
  const isFormValid =
    fullName &&
    email &&
    username &&
    password &&
    confirmPassword &&
    barNumber &&
    practiceArea &&
    yearsOfExperience &&
    certificate &&
    password === confirmPassword &&
    termsAccepted;

  // Update message based on validation
  const validateForm = () => {
    if (
      !fullName ||
      !email ||
      !username ||
      !password ||
      !confirmPassword ||
      !barNumber ||
      !practiceArea ||
      !yearsOfExperience
    ) {
      setMessage("Please fill all required fields");
      return false;
    } else if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return false;
    } else if (!certificate) {
      setMessage("Please upload your certificate");
      return false;
    } else if (!termsAccepted) {
      setMessage("Accept Terms & Privacy Policy");
      return false;
    } else {
      setMessage("Ready to proceed!");
      return true;
    }
  };

  // Handle certificate file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertificate(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Lawyer form submitted", {
        fullName,
        email,
        username,
        password,
        barNumber,
        practiceArea,
        yearsOfExperience,
        certificate: certificate?.name,
      });
      // Submit logic would go here
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center p-8 rounded-lg bg-[#2B3B3A] border border-[#DECEB0]/20 shadow-lg transition-all duration-300"
    >
      {/* Lawyer icon */}
      <div className="w-20 h-20 grid place-content-center text-4xl border border-[#DECEB0] rounded-full bg-[#2B3B3A] text-[#DECEB0] mb-6">
        <i className="fa fa-briefcase"></i>
      </div>

      {/* Title */}
      <div className="text-2xl font-bold text-[#DECEB0] mb-3">
        LAWYER SIGNUP
      </div>

      {/* Message */}
      <div
        className="text-center text-sm h-5 mb-6"
        style={{
          color: isFormValid ? "#92ff92" : "#fa2929",
        }}
      >
        {message}
      </div>

      <div className="w-full grid grid-cols-1 gap-5">
        {/* Personal Information Section */}
        <div className="border-b border-[#DECEB0]/20 pb-6 mb-4">
          <div className="text-base font-bold text-[#DECEB0] mb-4">
            Personal Information
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name field */}
            <div className="relative w-full">
              <div className="text-sm text-[#DECEB0]/80 mb-1">Full Name</div>
              <div className="relative flex items-center">
                <i className="fa fa-user absolute text-sm left-3 text-[#DECEB0]"></i>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block outline-none w-full rounded-md border border-[#DECEB0]/30 text-sm px-10 py-3 text-[#DECEB0] caret-[#DECEB0] bg-[#22302f] focus:border-[#DECEB0]/70"
                />
              </div>
            </div>

            {/* Email field */}
            <div className="relative w-full">
              <div className="text-sm text-[#DECEB0]/80 mb-1">
                Email Address
              </div>
              <div className="relative flex items-center">
                <i className="fa fa-envelope absolute text-sm left-3 text-[#DECEB0]"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block outline-none w-full rounded-md border border-[#DECEB0]/30 text-sm px-10 py-3 text-[#DECEB0] caret-[#DECEB0] bg-[#22302f] focus:border-[#DECEB0]/70"
                />
              </div>
            </div>
          </div>

          {/* Username field */}
          <div className="relative w-full mt-5">
            <div className="text-sm text-[#DECEB0]/80 mb-1">Username</div>
            <div className="relative flex items-center">
              <i className="fa fa-id-card absolute text-sm left-3 text-[#DECEB0]"></i>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block outline-none w-full rounded-md border border-[#DECEB0]/30 text-sm px-10 py-3 text-[#DECEB0] caret-[#DECEB0] bg-[#22302f] focus:border-[#DECEB0]/70"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            {/* Password field */}
            <div className="relative w-full">
              <div className="text-sm text-[#DECEB0]/80 mb-1">Password</div>
              <div className="relative flex items-center">
                <i className="fa fa-lock absolute text-sm left-3 text-[#DECEB0]"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block outline-none w-full rounded-md border border-[#DECEB0]/30 text-sm px-10 py-3 text-[#DECEB0] caret-[#DECEB0] bg-[#22302f] focus:border-[#DECEB0]/70"
                />
              </div>
            </div>

            {/* Confirm Password field */}
            <div className="relative w-full">
              <div className="text-sm text-[#DECEB0]/80 mb-1">
                Confirm Password
              </div>
              <div className="relative flex items-center">
                <i className="fa fa-check-circle absolute text-sm left-3 text-[#DECEB0]"></i>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block outline-none w-full rounded-md border border-[#DECEB0]/30 text-sm px-10 py-3 text-[#DECEB0] caret-[#DECEB0] bg-[#22302f] focus:border-[#DECEB0]/70"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information Section */}
        <div>
          <div className="text-base font-bold text-[#DECEB0] mb-4">
            Professional Information
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Bar Number field */}
            <div className="relative w-full">
              <div className="text-sm text-[#DECEB0]/80 mb-1">Bar Number</div>
              <div className="relative flex items-center">
                <i className="fa fa-id-badge absolute text-sm left-3 text-[#DECEB0]"></i>
                <input
                  type="text"
                  value={barNumber}
                  onChange={(e) => setBarNumber(e.target.value)}
                  className="block outline-none w-full rounded-md border border-[#DECEB0]/30 text-sm px-10 py-3 text-[#DECEB0] caret-[#DECEB0] bg-[#22302f] focus:border-[#DECEB0]/70"
                />
              </div>
            </div>

            {/* Practice Area field */}
            <div className="relative w-full">
              <div className="text-sm text-[#DECEB0]/80 mb-1">
                Practice Area
              </div>
              <div className="relative flex items-center">
                <i className="fa fa-gavel absolute text-sm left-3 text-[#DECEB0]"></i>
                <select
                  value={practiceArea}
                  onChange={(e) => setPracticeArea(e.target.value)}
                  className="block outline-none w-full rounded-md border border-[#DECEB0]/30 text-sm px-10 py-3 text-[#DECEB0] bg-[#22302f] focus:border-[#DECEB0]/70 appearance-none"
                >
                  <option value="" disabled>
                    Select Area
                  </option>
                  {practiceAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                <i className="fa fa-chevron-down absolute text-sm right-3 text-[#DECEB0]"></i>
              </div>
            </div>

            {/* Years of Experience field */}
            <div className="relative w-full">
              <div className="text-sm text-[#DECEB0]/80 mb-1">
                Years Experience
              </div>
              <div className="relative flex items-center">
                <i className="fa fa-clock-o absolute text-sm left-3 text-[#DECEB0]"></i>
                <input
                  type="number"
                  min="0"
                  max="70"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  className="block outline-none w-full rounded-md border border-[#DECEB0]/30 text-sm px-10 py-3 text-[#DECEB0] caret-[#DECEB0] bg-[#22302f] focus:border-[#DECEB0]/70"
                />
              </div>
            </div>
          </div>

          {/* Certificate Upload */}
          <div className="relative w-full mt-5">
            <div className="text-sm text-[#DECEB0]/80 mb-1">
              License Certificate
            </div>
            <div className="relative">
              <div className="flex items-center justify-center border-2 border-dashed border-[#DECEB0]/30 rounded-md p-6 bg-[#22302f]">
                <div className="text-center">
                  <i className="fa fa-file-pdf-o text-[#DECEB0] text-3xl mb-3"></i>
                  <div className="text-sm text-[#DECEB0]/80 mb-3">
                    {certificate
                      ? certificate.name
                      : "Upload your certificate (PDF, JPG, PNG)"}
                  </div>
                  <label
                    htmlFor="certificate-upload"
                    className="px-6 py-2 bg-[#DECEB0]/20 text-[#DECEB0] text-sm rounded cursor-pointer hover:bg-[#DECEB0]/30 transition-all duration-300"
                  >
                    Browse Files
                  </label>
                  <input
                    id="certificate-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="text-sm mt-3">
          <label
            htmlFor="lawyer-terms"
            className="flex items-center cursor-pointer text-[#DECEB0]/80"
          >
            <input
              type="checkbox"
              id="lawyer-terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mr-2 cursor-pointer h-5 w-5"
            />
            I agree to the{" "}
            <a href="#" className="mx-1 text-[#DECEB0] hover:underline">
              Terms
            </a>{" "}
            &{" "}
            <a href="#" className="ml-1 text-[#DECEB0] hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!isFormValid}
        className={`px-8 py-3 mt-8 border-none bg-[#DECEB0] text-[#2B3B3A] font-bold text-base rounded-md transition-all duration-300 hover:opacity-90 w-1/2 ${
          !isFormValid ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Create Lawyer Account
      </button>

      {/* Login link */}
      <div className="text-[#DECEB0]/70 text-sm mt-5">
        Already have an Account?
        <a
          href="/Login"
          className="no-underline text-[#DECEB0] ml-1 hover:underline"
        >
          Login
        </a>
      </div>
    </form>
  );
};

export default Signup;
