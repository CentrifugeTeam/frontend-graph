import { setSortType } from "@/features/SearchFilter/model/searchFilterSlice";
import { selectSortType } from "@/features/SearchFilter/model/selectors";
import CrossIcon from "@/shared/assets/CrossIcon";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";

interface FilterModalProps {
  onClose: () => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
`;

const Overlay = styled.div<{ $isClosing: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${({ $isClosing }) => ($isClosing ? 0 : 1)};
  transition: opacity 0.3s ease-in-out;
`;

const ModalContent = styled.div<{ $isClosing: boolean }>`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.colors.background};
  border-radius: 20px;
  height: 192px;
  width: 90%;
  max-width: 373px;
  padding: 0 16px 8px 16px;
  position: relative;
  animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.3s ease;
`;

const Title = styled.p`
  font-size: 20px;
  line-height: 24px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primaryText};
  margin-top: 24px;
  align-self: center;
`;

const CloseButton = styled.button`
  position: absolute;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  top: 24px;
  right: 23px;
  background-color: ${(props) => props.theme.colors.background};
  border: none;
  cursor: pointer;
`;

const RadioButtonWrapper = styled.div`
  margin-top: auto;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  height: 60px;
  width: 100%;
  cursor: pointer;
  position: relative;
`;

const RadioInput = styled.input`
  opacity: 0;
  position: absolute;
  z-index: -1;
  width: 0;
  height: 0;
`;

const StyledRadio = styled.div<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid #6534ff;
  border-radius: 50%;
  position: relative;
  margin-right: 14px;
  transition: 0.2s ease-in-out;

  ${RadioInput}:checked + & {
    background: #6534ff;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: white;
    }
  }
`;

const RadioText = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: ${(props) => props.theme.colors.primaryText};
`;

const FilterModal: FC<FilterModalProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const sortType = useSelector(selectSortType);
  const [isClosing, setIsClosing] = useState(false);
  const { t } = useTranslation();

  const handleOptionChange = (value: string) => {
    dispatch(setSortType(value));

    // чтобы пользователь успел увидеть анимацию выбора
    setTimeout(() => {
      handleClose();
    }, 100);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  return (
    <Overlay $isClosing={isClosing} onClick={handleClose}>
      <ModalContent $isClosing={isClosing} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>
          <CrossIcon />
        </CloseButton>
        <Title>{t("filtermodal.title")}</Title>

        <RadioButtonWrapper>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="sortOption"
              value="alphabet"
              checked={sortType === "alphabet"}
              onChange={() => handleOptionChange("alphabet")}
            />
            <StyledRadio checked={sortType === "alphabet"} />
            <RadioText>{t("filtermodal.byAlphabet")}</RadioText>
          </RadioLabel>

          <RadioLabel>
            <RadioInput
              type="radio"
              name="sortOption"
              value="birthDate"
              checked={sortType === "birthDate"}
              onChange={() => handleOptionChange("birthDate")}
            />
            <StyledRadio checked={sortType === "birthDate"} />
            <RadioText>{t("filtermodal.byBirthday")}</RadioText>
          </RadioLabel>
        </RadioButtonWrapper>
      </ModalContent>
    </Overlay>
  );
};

export default FilterModal;
