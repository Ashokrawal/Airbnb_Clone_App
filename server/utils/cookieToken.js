const cookieToken = (user, res) => {
  const token = user.getJwtToken();

  // Convert days from .env to milliseconds. Fallback to 1 day if not defined.
  const cookieExpiryDays = process.env.COOKIE_TIME || 1;

  const options = {
    expires: new Date(Date.now() + cookieExpiryDays * 24 * 60 * 60 * 1000),
    httpOnly: true, // Prevents XSS attacks by hiding cookie from frontend JS
    secure: true, // Required for SameSite: 'none'
    sameSite: "none", // Essential for cross-origin (React on 5173, Express on 8000)
    path: "/",
  };

  // Remove password from the user object before sending response for security
  user.password = undefined;

  res.status(200).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

export default cookieToken;
