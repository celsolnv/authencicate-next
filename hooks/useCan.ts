import { AuthContext } from "./../contexts/AuthContext";
import { useContext } from "react";
import { validateUserPermissions } from "../utils/validateUserPermissions";
type UseCamParams = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions, roles }: UseCamParams) {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidPermissions = validateUserPermissions({
    user,
    permissions,
    roles,
  });

  return userHasValidPermissions;
}
