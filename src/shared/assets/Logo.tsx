import styled from "styled-components";

const Container = styled.div`
  display: flex;
  height: 28px;
  gap: 5px;
`;

const Left = styled.h1`
  font-size: 20px;
  margin: 0;
`;
const Right = styled.h1`
  background-color: #f27638;
  color: #ffffff;
  border-radius: 5px;
  font-size: 20px;
  margin: 0;
  text-align: center;
  padding: 1px 5px 0px 5px;
`;

const Logo = () => {
  return (
    <Container>
      <Left>Docker</Left>
      <Right>Graph</Right>
    </Container>
  );
};

export default Logo;
