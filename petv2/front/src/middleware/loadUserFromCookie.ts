import { login } from '../Redux/actions/authActions';
import { AppDispatch } from '../Redux/store';
import { verifySession } from '../Api/authApi';
import axiosInstance from '../Api/axiosInstance';

export const loadUserFromCookie = () => async (dispatch: AppDispatch) => {
  // Token is in HttpOnly cookie - we can't read it via JavaScript
  // Check if we have user data in localStorage to restore state
  const storedFullName = localStorage.getItem('fullName');
  const storedUserId = localStorage.getItem('userId');
  const storedRoleId = localStorage.getItem('roleId');
  const storedShelterId = localStorage.getItem('shelterId');

  // If no stored user data, try to verify session via API
  if (!storedFullName) {
    // Try to verify session via API (cookie is HttpOnly, sent automatically)
    try {
      const sessionData = await verifySession();
      if (sessionData?.user) {
        dispatch(
          login.fulfilled(
            {
              userId: sessionData.user.userId,
              fullName: sessionData.user.fullName,
              roleId: sessionData.user.roleId,
              shelterId: sessionData.user.shelterId || null,
            },
            '',
            { email: '', password: '' }
          )
        );
        return;
      }
    } catch (error) {
      // Fallback: If /auth/me doesn't exist, try using a lightweight protected endpoint
      // to verify the session (cookie will be sent automatically)
      // Variables already declared at top of function
      if (!storedFullName) {
        // No stored data, can't restore
        return;
      }

      try {
        // Try to use animals list endpoint as session verification
        // Use the stored shelterId if available, otherwise use 1 as fallback
        const API_URL =
          process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
        const shelterIdForTest = storedShelterId || '1';
        const testResponse = await axiosInstance.get(
          `${API_URL}/animals/list/${shelterIdForTest}`
        );
        // If this succeeds, session is valid - restore from localStorage
        // Restore state from localStorage
        dispatch(
          login.fulfilled(
            {
              userId: storedUserId ? parseInt(storedUserId) : null,
              fullName: storedFullName,
              roleId: storedRoleId ? parseInt(storedRoleId) : null,
              shelterId: storedShelterId ? parseInt(storedShelterId) : null,
            },
            '',
            { email: '', password: '' }
          )
        );
        return;
      } catch (testError: any) {
        // Test endpoint failed - check if it's a 401 (unauthorized) vs other error
        // If 401, session is invalid. If other error (404, 403, etc.), might still be valid
        const isUnauthorized = testError?.response?.status === 401;

        if (isUnauthorized) {
          // Session is definitely invalid - don't restore
          return;
        }

        // For other errors (404, 403, network), assume session might still be valid
        // and restore from localStorage - the next API call will verify
        // Restore state from localStorage anyway - let next API call verify
        dispatch(
          login.fulfilled(
            {
              userId: storedUserId ? parseInt(storedUserId) : null,
              fullName: storedFullName,
              roleId: storedRoleId ? parseInt(storedRoleId) : null,
              shelterId: storedShelterId ? parseInt(storedShelterId) : null,
            },
            '',
            { email: '', password: '' }
          )
        );
      }
    }
    return;
  }

  // If we have stored user data, verify session and restore
  if (storedFullName) {
    // Try to verify session via API first
    try {
      const sessionData = await verifySession();
      if (sessionData?.user) {
        // Use API data if available (more up-to-date)
        dispatch(
          login.fulfilled(
            {
              userId: sessionData.user.userId,
              fullName: sessionData.user.fullName,
              roleId: sessionData.user.roleId,
              shelterId: sessionData.user.shelterId || null,
            },
            '',
            { email: '', password: '' }
          )
        );
        return;
      }
    } catch (error) {
      // API verification failed - session likely invalid
      // Clear localStorage and don't restore state
      localStorage.clear();
      return;
    }
  }
};
