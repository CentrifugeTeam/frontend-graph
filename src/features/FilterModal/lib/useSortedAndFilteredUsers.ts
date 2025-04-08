import { User } from "@/entities/user/api/fetchProfiles";
import { useMemo } from "react";
import { isBefore, addYears, setYear } from "date-fns";
import { useTranslation } from "react-i18next";

// Тип для элементов массива sortedUsersWithSeparators
type ListItem = { type: "separator" } | { type: "user"; user: User };

export const useSortedAndFilteredUsers = (
  users: User[] | undefined,
  filters: { searchQuery: string; sortType: string }
) => {
  const { t } = useTranslation(); // Используем i18n для переводов

  const filteredUsers = useMemo(() => {
    return users
      ? users.filter((user) => {
          const { firstName, lastName, userTag } = user;
          const query = filters.searchQuery.toLowerCase();
          return (
            firstName.toLowerCase().includes(query) ||
            lastName.toLowerCase().includes(query) ||
            userTag.toLowerCase().includes(query)
          );
        })
      : [];
  }, [users, filters.searchQuery]);

  // Функция форматирования даты
  const formatDateForDisplay = (birthday: string): string => {
    const date = new Date(birthday);
    const day = date.getDate();
    const monthIndex = date.getMonth();

    // Получаем перевод месяца через i18n
    const month = t(`month.${monthIndex}`);
    return `${day} ${month}`;
  };

  // Сортировка пользователей
  const sortedUsers = useMemo(() => {
    return [...(filteredUsers || [])].sort((a, b) => {
      if (filters.sortType === "alphabet") {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      } else if (filters.sortType === "birthDate") {
        const today = new Date();
        const currentYear = today.getFullYear();

        const getNextBirthday = (birthday: string): Date => {
          const birthdayDate = new Date(birthday);
          let nextBirthday = setYear(birthdayDate, currentYear);
          if (isBefore(nextBirthday, today)) {
            nextBirthday = addYears(nextBirthday, 1);
          }
          return nextBirthday;
        };

        const aNext = getNextBirthday(a.birthday);
        const bNext = getNextBirthday(b.birthday);
        return aNext.getTime() - bNext.getTime();
      }
      return 0;
    });
  }, [filteredUsers, filters.sortType]);

  // Добавление сепаратора между текущим и следующим годом
  const sortedUsersWithSeparators = useMemo(() => {
    if (filters.sortType === "birthDate") {
      const today = new Date();
      const currentYear = today.getFullYear();
      let hasCurrentYear = false;
      let hasNextYear = false;

      sortedUsers.forEach((user) => {
        const nextBirthday = setYear(new Date(user.birthday), currentYear);
        if (isBefore(nextBirthday, today)) {
          nextBirthday.setFullYear(currentYear + 1);
        }
        if (nextBirthday.getFullYear() === currentYear) hasCurrentYear = true;
        else hasNextYear = true;
      });

      let separatorAdded = false;
      return sortedUsers.reduce((acc: ListItem[], user) => {
        const nextBirthday = setYear(new Date(user.birthday), currentYear);
        if (isBefore(nextBirthday, today)) {
          nextBirthday.setFullYear(currentYear + 1);
        }

        if (
          !separatorAdded &&
          hasNextYear &&
          hasCurrentYear &&
          nextBirthday.getFullYear() > currentYear
        ) {
          acc.push({ type: "separator" });
          separatorAdded = true;
        }
        acc.push({ type: "user", user });
        return acc;
      }, []);
    }
    return sortedUsers.map((user) => ({ type: "user", user }));
  }, [sortedUsers, filters.sortType]) as ListItem[];

  return {
    sortedUsersWithSeparators,
    formatDateForDisplay,
  };
};
