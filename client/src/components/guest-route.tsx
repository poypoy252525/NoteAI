import { api } from "@/services/axios-instance";
import { useAuth } from "@/stores/token";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const GuestRoute = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  console.log(accessToken);

  useEffect(() => {
    api
      .post("/auth/refresh", {}, { withCredentials: true })
      .then((response) => {
        const newAccessToken = response.data.accessToken;
        if (newAccessToken) {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [accessToken, navigate]);

  return <Outlet />;
};

export default GuestRoute;
