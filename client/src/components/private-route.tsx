import { api } from "@/services/axios-instance";
import { useAuth } from "@/stores/auth";
import { useEffect, useState } from "react";
import SessionLoader from "./session-loader";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { accessToken, setAuth } = useAuth();
  const [loading, setLoading] = useState(!accessToken);

  useEffect(() => {
    if (!accessToken) {
      setLoading(true);
      api
        .post("/auth/refresh", {}, { withCredentials: true })
        .then((response) => {
          const newAccessToken = response.data.accessToken;
          console.log(newAccessToken);
          setAuth(newAccessToken, response.data.user);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [accessToken, setAuth]);

  if (loading) {
    return <SessionLoader message="Checking session…" variant="spinner" />;
  }

  if (!accessToken && !loading) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
