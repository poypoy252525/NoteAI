import { api } from "@/services/axios-instance";
import { useAuth } from "@/stores/auth";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const GuestRoute = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

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
        console.log(error);
      });
  }, [accessToken, navigate]);

  return <Outlet />;
};

export default GuestRoute;
