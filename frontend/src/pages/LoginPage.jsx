// Tooo much skill issue with this component rn please ignore thankyou

// import { useState, useEffect } from "react";
import LoginCard from "../components/LoginCard";
// import validateTokenFE from "../utils/validateTokenFE";
// import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  // const navigate = useNavigate();
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const validateToken = async () => {
  //     const result = await validateTokenFE();
  //     const { isValid } = result;
  //     if (isValid) {
  //       navigate("/dashboard");
  //     } else {
  //       setIsLoading(false);
  //     }
  //   };
  //   validateToken();
  // }, []);

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }

  return (
    <section className="flex justify-center items-center min-h-screen">
      <LoginCard />
    </section>
  );
};

export default LoginPage;
