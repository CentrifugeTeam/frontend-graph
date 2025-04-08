import styled from "styled-components";
import { useEffect, useRef } from "react";
import { setActiveTab } from "../model/searchFilterSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/types";
import { useTranslation } from "react-i18next";
import { departmentTranslate } from "@/shared/utils/departmentTranslate";

interface TabProps {
  $active: boolean;
}

const TabsContainer = styled.div`
  height: 44px;
  position: relative;
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  margin-top: auto;
  scrollbar-width: none;
  user-select: none;
  padding: 16px 16px 0px 16px;
  border-bottom: 0.5px solid #97979b;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.div<TabProps>`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-size: 15px;
  font-weight: ${(props) => (props.$active ? "600" : "500")};
  color: ${(props) =>
    props.$active
      ? props.theme.colors.activeTab
      : props.theme.colors.inactiveTab};
  line-height: 20px;
  cursor: pointer;
  padding: 0 13px 10px 13px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
`;

const Indicator = styled.div`
  position: absolute;
  bottom: 0;
  height: 2px;
  background-color: #6534ff;
  transition: all 0.3s ease;
`;

const tabs = [
  "Все",
  "Дизайн",
  "Аналитика",
  "Менеджмент",
  "iOS",
  "Android",
  "QA",
  "Бэк-офис",
  "Frontend",
  "HR",
  "PR",
  "Backend",
  "Техподдержка",
];

export const DepartmentSelector = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.searchFilter.activeTab);
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateIndicatorPosition = () => {
      const container = containerRef.current;
      const indicator = indicatorRef.current;

      if (!container || !indicator) return;

      const activeTabElement = container.querySelector(
        `[data-active="true"]`
      ) as HTMLDivElement | null;

      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;
        indicator.style.left = `${offsetLeft}px`;
        indicator.style.width = `${offsetWidth}px`;
      }
    };

    updateIndicatorPosition();
  }, [activeTab]);

  const translatedTabs = tabs.map((tab) => ({
    key: tab,
    label: t(`departments.${departmentTranslate[tab]}`),
  }));

  return (
    <TabsContainer ref={containerRef}>
      {translatedTabs.map(({ key, label }) => (
        <Tab
          key={key}
          $active={activeTab === key}
          onClick={() => dispatch(setActiveTab(key))}
          data-active={activeTab === key}
        >
          {label}
        </Tab>
      ))}
      <Indicator ref={indicatorRef} />
    </TabsContainer>
  );
};
export default DepartmentSelector;
