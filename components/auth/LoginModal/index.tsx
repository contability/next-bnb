import styled from 'styled-components';
import palette from '../../../styles/palette';
import CloseXIcon from '../../../public/assets/images/icons/system/system_close_x_icon.svg';
import MailIcon from '../../../public/assets/images/icons/system/system_mail.svg';
import OpenedEyeIcon from '../../../public/assets/images/icons/system/system_opened_eye.svg';
import ClosedEyeIcon from '../../../public/assets/images/icons/system/system_closed_eye.svg';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authActions } from '../../../store/auth';

const Container = styled.form`
  width: 568px;
  padding: 32px;
  background-color: white;
  z-index: 11;

  .modal-close-x-icon {
    cursor: pointer;
    display: block;
    margin: 0 0 40px auto;
    width: 24px;
  }

  svg {
    top: 10px;
  }

  .login-input-wrapper {
    position: relative;
    margin-bottom: 16px;
  }

  .login-password-input-wrapper {
    svg {
      cursor: pointer;
    }
  }

  .login-modal-submit-button-wrapper {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid ${palette.gray_eb};
  }

  .login-modal-set-signup {
    color: ${palette.dark_cyan};
    margin-left: 8px;
    cursor: pointer;
  }
`;

interface IProps {
  closeModal: () => void;
}

const LoginModal: React.FC<IProps> = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isPasswordHided, setIsPasswordHided] = useState(true);

  const dispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
      case 'email':
        setEmail(event.target.value);
        break;
      default:
        setPassword(event.target.value);
    }
  };

  const changeToSignUpModal = () => {
    dispatch(authActions.setAuthMode('signUp'));
  };

  return (
    <Container>
      <CloseXIcon className="modal-close-x-icon" onClick={closeModal} />
      <div className="login-input-wrapper">
        <Input
          placeholder="이메일 주소"
          name="email"
          type="email"
          icon={<MailIcon />}
          onChange={handleChange}
          value={email}
        />
      </div>
      <div className="login-input-wrapper login-password-input-wrapper">
        <Input
          placeholder="비밀번호 설정하기"
          icon={
            isPasswordHided ? (
              <ClosedEyeIcon onClick={() => setIsPasswordHided(false)} />
            ) : (
              <OpenedEyeIcon onClick={() => setIsPasswordHided(true)} />
            )
          }
          type={isPasswordHided ? 'password' : 'text'}
          onChange={handleChange}
          value={password}
        />
      </div>
      <div className="login-modal-submit-button-wrapper">
        <Button type="submit">로그인</Button>
      </div>
      <p>
        계정이 없나요?
        <span className="login-modal-set-signup" onClick={changeToSignUpModal}>
          회원가입
        </span>
      </p>
    </Container>
  );
};

export default LoginModal;