import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const token = cookies.get('token');

  if (token) {
    return {
      auth: {
        isAuthenticated: true,
        token: token
      }
    };
  }
  return {
    auth: {
      isAuthenticated: false,
      token: null
    }
  };
};