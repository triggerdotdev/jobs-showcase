type User = {
  id: string;
  name: string;
  email: string;
  logins: number;
  summariesEnabled: boolean;
};

export const weeklySummaryDb = {
  getUsers() {
    return [
      {
        id: "1",
        name: "Dan",
        email: "dan@acme.inc",
        logins: 5,
        summariesEnabled: true,
      },
      {
        id: "2",
        name: "Jane",
        email: "jane@acme.inc",
        logins: 2,
        summariesEnabled: false,
      },
      {
        id: "3",
        name: "Matt",
        email: "test@acme.inc",
        logins: 10,
        summariesEnabled: true,
      },
      {
        id: "4",
        name: "Julie",
        email: "test@acme.inc",
        logins: 10,
        summariesEnabled: false,
      },
    ];
  },
};
