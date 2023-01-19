import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 400px;
  height: 400px;
  background-color: white;
  z-index: 11;
`;

const SignUpModal: React.FC = () => {
  return <Container>Sign Up</Container>;
};

export default SignUpModal;