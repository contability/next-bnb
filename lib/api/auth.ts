import axios from '.';
import { UserType } from '../../types/user';

interface SignUpAPIBody {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  birthday: string;
}

export const signupAPI = (body: SignUpAPIBody) => {
  return axios.post<UserType>('/api/auth/signup', body);
};