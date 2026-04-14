export interface UserStatsRegistrationDay {
  day: number;
  date: string;
  count: number;
}

export interface UserStatsQueryData {
  userStats: {
    registrationsMonth: number;
    registrationsByDay: UserStatsRegistrationDay[];
  };
}

export interface RegistrationByDayRow {
  day: number;
  count: number;
}
