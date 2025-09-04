import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import logo from '../images/logo.png';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentPopup from './Paymentpopup';

const Login = () => {
  const [userType, setUserType] = useState('Driver');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [authData, setAuthData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Set userType based on state from navigation
  useEffect(() => {
    const userTypeFromState = location.state?.userType;
    if (userTypeFromState === 'School' || userTypeFromState === 'Driver') {
      setUserType(userTypeFromState);
    }
  }, [location.state]);

  // Check if user is already logged in
  const token = localStorage.getItem('token');
  const storedUserType = localStorage.getItem('userType');
  useEffect(() => {
    if (token && storedUserType) {
      if (storedUserType === 'Driver') {
        navigate('/driverdashboard');
      } else if (storedUserType === 'School') {
        navigate('/dashboard');
      }
    }
  }, [token, storedUserType, navigate]);

  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const response = await axios.post('https://fieldtriplinkbackend-production.up.railway.app/api/auth/login', {
  //       email,
  //       password,
  //     });

  //     const { token: newToken, user } = response.data;

  //     const expectedRole = userType === 'Driver' ? 'driver' : 'school_admin';
  //     const redirectUserType = userType === 'Driver' ? 'Driver' : 'School';

  //     if (user.role === expectedRole) {
  //       if (expectedRole === 'driver') {
  //         localStorage.setItem('token', newToken);
  //         localStorage.setItem('userType', redirectUserType);
  //         toast.success('Driver login successful!');
  //         navigate('/driverdashboard');
  //       } else {
  //         // toast.success('School Admin login successful!');
  //         setAuthData({ token: newToken, userType: redirectUserType });
  //         setShowPaymentPopup(true);
  //       }
  //     } else {
  //       toast.error('User role does not match the selected type.');
  //     }
  //   } catch (error) {
  //     const msg =
  //       error.response?.data?.message || 'Login failed. Please check your credentials.';
  //     toast.error(msg);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await axios.post(
      'https://fieldtriplinkbackend-production.up.railway.app/api/auth/login',
      {
        email,
        password,
      }
    );

    const { token: newToken, user } = response.data;

    const expectedRole = userType === 'Driver' ? 'driver' : 'school_admin';
    const redirectUserType = userType === 'Driver' ? 'Driver' : 'School';

    if (user.role === expectedRole) {
if (expectedRole === 'driver') {
  // ✅ Driver flow
  localStorage.setItem('token', newToken);
  localStorage.setItem('userType', redirectUserType);
  toast.success('Driver login successful!');
  navigate('/driverdashboard');
} else {
  // ❌ Do NOT save token yet for School
  try {
    const statusRes = await axios.get(
      'https://fieldtriplinkbackend-production.up.railway.app/api/school/subscription/status',
      { headers: { Authorization: `Bearer ${newToken}` } }
    );

    if (statusRes.data?.active) {
      // ✅ Active subscription → save token
      localStorage.setItem('token', newToken);
      localStorage.setItem('userType', redirectUserType);
      toast.success('School Admin login successful!');
      navigate('/dashboard');
    } else {
      // ❌ Not active → keep token only in state
      setAuthData({ token: newToken, userType: redirectUserType });
      setShowPaymentPopup(true);
    }
  } catch (statusError) {
    console.error('Subscription status error:', statusError);
    toast.error('Unable to verify subscription status. Please try again.');
  }
}

    } else {
      toast.error('User role does not match the selected type.');
    }
  } catch (error) {
    const msg =
      error.response?.data?.message ||
      'Login failed. Please check your credentials.';
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};





  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate('/emailvarification', { state: { userType } });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePaymentSuccess = () => {
    if (authData) {
      localStorage.setItem('token', authData.token);
      localStorage.setItem('userType', authData.userType);
      setShowPaymentPopup(false);
      navigate('/dashboard');
    }
  };

  useEffect(() => {
  const checkAccess = async () => {
    if (token && storedUserType) {
      if (storedUserType === 'Driver') {
        navigate('/driverdashboard');
      } else if (storedUserType === 'School') {
        try {
          const statusRes = await axios.get(
            'https://fieldtriplinkbackend-production.up.railway.app/api/school/subscription/status',
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (statusRes.data?.active) {
            navigate('/dashboard');
          } else {
            // ❌ Kick user back to login
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            toast.error('Please complete your payment to access the dashboard.');
            navigate('/');
          }
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          navigate('/');
        }
      }
    }
  };
  checkAccess();
}, [token, storedUserType, navigate]);





  const handlePaymentClose = () => {
    setShowPaymentPopup(false);
    setAuthData(null);
    toast.info('Please complete payment to proceed.');
  };

  if (token && storedUserType) {
    return <Navigate to={storedUserType === 'Driver' ? '/driverdashboard' : '/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center px-6 lg:px-[35px] py-6 lg:py-0">
        <div onClick={handleLogoClick} className="cursor-pointer">
          <img src={logo} alt="Logo" className="w-full max-w-[400px] lg:max-w-none" />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-[55%] bg-[#f9fafb] flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-6 lg:py-0">
        <h2 className="text-2xl sm:text-3xl lg:text-[32px] archivosemibold text-center mb-1">Sign In to your Account</h2>
        <p className="text-center text-sm sm:text-base lg:text-[16px] text-[#666666] interregular mb-6">Log in to start your journey</p>

        {/* Toggle */}
        <div className="flex mb-6 w-full sm:w-[400px] h-[58px] mx-auto rounded-[8px] overflow-hidden border border-gray-200 bg-white p-[4px]">
          <div className="relative flex w-full">
            <div
              className={`absolute w-1/2 h-full bg-[#de3b40] rounded-[8px] transition-transform duration-300 ease-in-out ${
                userType === 'School' ? 'translate-x-0' : 'translate-x-full'
              }`}
            />
            <button
              onClick={() => setUserType('School')}
              className={`relative w-1/2 py-2 text-sm lg:text-[14px] font-semibold transition-colors duration-300 cursor-pointer ${
                userType === 'School' ? 'text-white' : 'text-[#de3b40]'
              } z-10`}
            >
              School
            </button>
            <button
              onClick={() => setUserType('Driver')}
              className={`relative w-1/2 py-2 text-sm lg:text-[14px] font-semibold transition-colors duration-300 cursor-pointer ${
                userType === 'Driver' ? 'text-white' : 'text-[#de3b40]'
              } z-10`}
            >
              Driver
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 lg:mt-[20px]">
          <div className="mb-4">
            <label className="block text-sm lg:text-[14px] inter-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm lg:text-base"
              required
            />
          </div>

          <div className="mb-1">
            <label className="block text-sm lg:text-[14px] inter-semibold mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm lg:text-base"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <i className={showPassword ? 'far fa-eye-slash' : 'far fa-eye'}></i>
              </button>
            </div>
          </div>

          <div className="text-right mb-6 lg:mb-[60px]">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[#de3b40] text-sm lg:text-[14px] inter-medium hover:underline cursor-pointer"
            >
              Forgot Password
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#de3b40] hover:bg-red-600 text-white rounded-[8px] font-medium h-[48px] text-sm lg:text-base transition-colors duration-300 flex items-center justify-center cursor-pointer ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm lg:text-[14px] interregular mt-4 lg:mt-4">
          Don’t have an account?{' '}
          <button
            onClick={handleSignUp}
            className="text-[#de3b40] inter-semibold hover:underline cursor-pointer"
          >
            Sign up
          </button>
        </p>
      </div>

      {showPaymentPopup && (
        <PaymentPopup onSuccess={handlePaymentSuccess} onClose={handlePaymentClose}  token={authData?.token} />
      )}
      <ToastContainer />
    </div>
  );
};

export default Login;