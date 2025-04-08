import { useTranslation } from "react-i18next";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  margin-left: 25px;
  margin-bottom: 25px;
  z-index: 1002;
`;

const Block = styled.div`
  display: flex;
  align-items: center;
  width: 232px;
  height: 40px;
  background-color: #f5f6f8;
  border: 1px solid #e6e6e7;
  border-radius: 6px;
  padding-left: 25px;
  padding-right: 25px;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 14px;
  font-weight: 400;
  margin: 0 0 10px 0;
`;

const RedRound = styled.div`
  width: 13.33px;
  height: 13.33px;
  border-radius: 50%;
  background-color: #d82c20;
`;

const GreenRound = styled.div`
  width: 13.33px;
  height: 13.33px;
  border-radius: 50%;
  background-color: #009639;
`;

const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #454545;
  margin: 0;
`;

export const HeatMap = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Title>{t("content.heat_map")}</Title>
      <Block>
        <RedRound />
        <Paragraph>{t("content.load_h")}</Paragraph>
        <GreenRound />
        <Paragraph>{t("content.load_l")}</Paragraph>
      </Block>
    </Container>
  );
};
