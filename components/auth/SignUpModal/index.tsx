import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import palette from '../../../styles/palette';
import CloseXIcon from '../../../public/assets/images/icons/system/system_close_x_icon.svg';
import MailIcon from '../../../public/assets/images/icons/system/system_mail.svg';
import PersonIcon from '../../../public/assets/images/icons/system/system_person.svg';
import OpenedEyeIcon from '../../../public/assets/images/icons/system/system_opened_eye.svg';
import ClosedEyeIcon from '../../../public/assets/images/icons/system/system_closed_eye.svg';
import Input from '../../common/Input';
import Selector from '../../common/Selector';
import { dayList, monthList, yearList } from '../../../lib/staticData';
import Button from '../../common/Button';
import { signupAPI } from '../../../lib/api/auth';
import { useDispatch } from 'react-redux';
import { userActions } from '../../../store/user';
import useValidateMode from '../../../hooks/useValidateMode';
import PasswordWarning from '../PassWordWarning';
import { authActions } from '../../../store/auth';

const Container = styled.form`
  width: 400px;
  padding: 32px;
  background-color: white;
  z-index: 11;
  border-radius: 10px;

  .modal-close-x-icon {
    cursor: pointer;
    display: block;
    margin: 0 0 40px auto;
    width: 24px;
  }

  .input-wrapper {
    position: relative;
    margin-bottom: 16px;

    svg {
      position: absolute;
      right: 11px;
      top: 16px;
    }
  }

  .sign-up-password-input-wrapper {
    svg {
      cursor: pointer;
    }
  }

  .sign-up-birthdat-label {
    font-size: 16px;
    font-weight: 600;
    margin-top: 16px;
    margin-bottom: 8px;
  }

  .sign-up-modal-birthday-info {
    margin-bottom: 16px;
    color: ${palette.charcoal};
  }

  .sign-up-modal-birthday-selectors {
    display: flex;
    margin-bottom: 24px;
    .sign-up-modal-birthday-month-selector {
      margin-right: 16px;
      flex-grow: 1;
    }
    .sign-up-modal-birthday-day-selector {
      margin-right: 16px;
      width: 25%;
    }
    .sign-up-modal-birthday-year-selector {
      width: 33.3333%;
    }
  }

  .sign-up-modal-submit-button-wrapper {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid ${palette.gray_eb};
  }

  .sign-up-modal-set-login {
    color: ${palette.dark_cyan};
    margin-left: 8px;
    cursor: pointer;
  }
`;

interface SignUpModalProps {
  closeModal: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [birthYear, setBirthYear] = useState<string | undefined>();
  const [birthMonth, setBirthMonth] = useState<string | undefined>();
  const [birthDay, setBirthDay] = useState<string | undefined>();

  const [passwordFocused, setPasswordFocused] = useState(false);

  const dispatch = useDispatch();
  const { setValidateMode } = useValidateMode();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.className) {
      case 'email':
        setEmail(event.target.value);
        break;
      case 'firstName':
        setFirstName(event.target.value);
        break;
      case 'lastName':
        setLastName(event.target.value);
        break;
      case 'pw':
        setPassword(event.target.value);
        break;
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    switch (event.target.className) {
      case 'day':
        setBirthDay(event.target.value);
        break;
      case 'month':
        setBirthMonth(event.target.value);
        break;
      case 'year':
        setBirthYear(event.target.value);
        break;

      default:
        break;
    }
  };

  const toggleHidePassword = () => {
    setHidePassword(!hidePassword);
  };

  /** ?????? ?????? ??? ?????? ??? ?????? */
  const validateSignUpForm = () => {
    // ?????? ?????? ?????? ???
    if (!email || !lastName || !firstName || !password) return false;
    // ??????????????? ???????????? ?????? ???
    if (isPasswordHasNameOrEmail || !isPasswordOverMinLength || isPasswordHasNumberOrSymbol) return false;
    // ???????????? ????????? ?????? ?????? ???
    if (!birthDay || !birthMonth || !birthYear) return false;
    return true;
  };

  const onSubmitSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // dispatch(commonActions.setValidateMode(true));
    setValidateMode(true);

    if (validateSignUpForm()) {
      try {
        const signUpBody = {
          email,
          firstName,
          lastName,
          password,
          birthday: new Date(`${birthYear}-${birthMonth!.replace('???', '')}-${birthDay}`).toISOString(),
        };

        const { data } = await signupAPI(signUpBody);
        dispatch(userActions.setLoggedUser({ ...data, isLogged: true }));
        closeModal();

        console.log('data is : ', data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onFocusPassword = () => {
    setPasswordFocused(true);
  };

  /** ??????????????? ?????? ?????? ????????? ????????? ??????????????? ?????? */
  const isPasswordHasNameOrEmail = useMemo(
    () => !password || !lastName || password.includes(lastName) || password.includes(email.split('@')[0]),
    [password, lastName, email],
  );

  /** ???????????? ?????? ???????????? 8??? ?????? */
  const PASSWORD_MIN_LENGTH = 8;
  const isPasswordOverMinLength = useMemo(() => !!password && password.length >= PASSWORD_MIN_LENGTH, [password]);

  /** ??????????????? ??????????????? ???????????? ????????? || ????????? ???????????? ????????? ??????*/
  const isPasswordHasNumberOrSymbol = useMemo(
    () => !(/[{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"]/g.test(password) || /[0-9]/g.test(password)),
    [password],
  );

  const changeToLoginModal = () => {
    dispatch(authActions.setAuthMode('login'));
  };

  useEffect(() => {
    return () => {
      setValidateMode(false);
    };
  }, []);

  return (
    <Container onSubmit={onSubmitSignUp}>
      <CloseXIcon className="modal-close-x-icon" onClick={closeModal} />
      <div className="input-wrapper">
        <Input
          placeholder="????????? ??????"
          type={'email'}
          name={'email'}
          icon={<MailIcon />}
          className="email"
          onChange={handleChange}
          value={email}
          useValidation
          isValid={!!email}
          errorMessage="???????????? ???????????????."
        />
      </div>
      <div className="input-wrapper">
        <Input
          placeholder="??????(???:??????)"
          type={'text'}
          icon={<PersonIcon />}
          className="firstName"
          onChange={handleChange}
          value={firstName}
          useValidation
          isValid={!!firstName}
          errorMessage="????????? ???????????????."
        />
      </div>
      <div className="input-wrapper">
        <Input
          placeholder="???(???:???)"
          type={'text'}
          icon={<PersonIcon />}
          className="lastName"
          onChange={handleChange}
          value={lastName}
          useValidation
          isValid={!!lastName}
          errorMessage="?????? ???????????????."
        />
      </div>
      <div className="input-wrapper sign-up-password-input-wrapper">
        <Input
          placeholder="???????????? ????????????"
          type={hidePassword ? 'password' : 'text'}
          icon={
            hidePassword ? (
              <ClosedEyeIcon onClick={toggleHidePassword} />
            ) : (
              <OpenedEyeIcon onClick={toggleHidePassword} />
            )
          }
          className="pw"
          onChange={handleChange}
          value={password}
          useValidation
          isValid={!isPasswordHasNameOrEmail && isPasswordOverMinLength && !isPasswordHasNumberOrSymbol}
          errorMessage="??????????????? ???????????????."
          onFocus={onFocusPassword}
        />
      </div>
      {passwordFocused && (
        <>
          <PasswordWarning
            isValid={isPasswordHasNameOrEmail}
            text="??????????????? ?????? ???????????? ????????? ????????? ????????? ??? ????????????."
          />
          <PasswordWarning isValid={!isPasswordOverMinLength} text="?????? 8???" />
          <PasswordWarning isValid={isPasswordHasNumberOrSymbol} text="????????? ????????? ???????????????." />
        </>
      )}
      <p className="sign-up-birthdat-label">??????</p>
      <p className="sign-up-modal-birthday-info">
        ??? 18??? ????????? ????????? ???????????? ????????? ??? ????????????. ????????? ?????? ??????????????? ???????????? ????????????.
      </p>
      <div className="sign-up-modal-birthday-selectors">
        <div className="sign-up-modal-birthday-month-selector">
          <Selector
            options={monthList}
            defaultValue="???"
            disabledOptions={['???']}
            className="month"
            value={birthMonth}
            onChange={handleSelectChange}
            isValid={!!birthMonth}
          />
        </div>
        <div className="sign-up-modal-birthday-day-selector">
          <Selector
            options={dayList}
            defaultValue="???"
            disabledOptions={['???']}
            className="day"
            value={birthDay}
            onChange={handleSelectChange}
            isValid={!!birthDay}
          />
        </div>
        <div className="sign-up-modal-birthday-year-selector">
          <Selector
            options={yearList}
            defaultValue="???"
            disabledOptions={['???']}
            className="year"
            value={birthYear}
            onChange={handleSelectChange}
            isValid={!!birthYear}
          />
        </div>
      </div>
      <div className="sign-up-modal-submit-button-wrapper">
        <Button type="submit">?????? ??????</Button>
      </div>
      <p>
        ?????? ????????? ??????????
        <span className="sign-up-modal-set-login" role={'presentation'} onClick={changeToLoginModal}>
          ?????????
        </span>
      </p>
    </Container>
  );
};

export default SignUpModal;
