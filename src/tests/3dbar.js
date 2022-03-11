const originalData = [
  {
    contributionDays: [
      { contributionCount: 0, date: '2022-03-06', weekday: 0 },
      { contributionCount: 24, date: '2022-03-07', weekday: 1 },
      { contributionCount: 5, date: '2022-03-08', weekday: 2 },
      { contributionCount: 0, date: '2022-03-09', weekday: 3 },
    ],
    firstDay: '2022-03-06',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2022-02-27', weekday: 0 },
      { contributionCount: 4, date: '2022-02-28', weekday: 1 },
      { contributionCount: 1, date: '2022-03-01', weekday: 2 },
      { contributionCount: 1, date: '2022-03-02', weekday: 3 },
      { contributionCount: 8, date: '2022-03-03', weekday: 4 },
      { contributionCount: 14, date: '2022-03-04', weekday: 5 },
      { contributionCount: 7, date: '2022-03-05', weekday: 6 },
    ],
    firstDay: '2022-02-27',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2022-02-20', weekday: 0 },
      { contributionCount: 11, date: '2022-02-21', weekday: 1 },
      { contributionCount: 5, date: '2022-02-22', weekday: 2 },
      { contributionCount: 4, date: '2022-02-23', weekday: 3 },
      { contributionCount: 3, date: '2022-02-24', weekday: 4 },
      { contributionCount: 3, date: '2022-02-25', weekday: 5 },
      { contributionCount: 0, date: '2022-02-26', weekday: 6 },
    ],
    firstDay: '2022-02-20',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2022-02-13', weekday: 0 },
      { contributionCount: 1, date: '2022-02-14', weekday: 1 },
      { contributionCount: 4, date: '2022-02-15', weekday: 2 },
      { contributionCount: 1, date: '2022-02-16', weekday: 3 },
      { contributionCount: 7, date: '2022-02-17', weekday: 4 },
      { contributionCount: 3, date: '2022-02-18', weekday: 5 },
      { contributionCount: 0, date: '2022-02-19', weekday: 6 },
    ],
    firstDay: '2022-02-13',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2022-02-06', weekday: 0 },
      { contributionCount: 4, date: '2022-02-07', weekday: 1 },
      { contributionCount: 15, date: '2022-02-08', weekday: 2 },
      { contributionCount: 12, date: '2022-02-09', weekday: 3 },
      { contributionCount: 8, date: '2022-02-10', weekday: 4 },
      { contributionCount: 3, date: '2022-02-11', weekday: 5 },
      { contributionCount: 3, date: '2022-02-12', weekday: 6 },
    ],
    firstDay: '2022-02-06',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2022-01-30', weekday: 0 },
      { contributionCount: 3, date: '2022-01-31', weekday: 1 },
      { contributionCount: 1, date: '2022-02-01', weekday: 2 },
      { contributionCount: 0, date: '2022-02-02', weekday: 3 },
      { contributionCount: 0, date: '2022-02-03', weekday: 4 },
      { contributionCount: 0, date: '2022-02-04', weekday: 5 },
      { contributionCount: 0, date: '2022-02-05', weekday: 6 },
    ],
    firstDay: '2022-01-30',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2022-01-23', weekday: 0 },
      { contributionCount: 10, date: '2022-01-24', weekday: 1 },
      { contributionCount: 7, date: '2022-01-25', weekday: 2 },
      { contributionCount: 9, date: '2022-01-26', weekday: 3 },
      { contributionCount: 6, date: '2022-01-27', weekday: 4 },
      { contributionCount: 1, date: '2022-01-28', weekday: 5 },
      { contributionCount: 0, date: '2022-01-29', weekday: 6 },
    ],
    firstDay: '2022-01-23',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2022-01-16', weekday: 0 },
      { contributionCount: 8, date: '2022-01-17', weekday: 1 },
      { contributionCount: 5, date: '2022-01-18', weekday: 2 },
      { contributionCount: 9, date: '2022-01-19', weekday: 3 },
      { contributionCount: 7, date: '2022-01-20', weekday: 4 },
      { contributionCount: 40, date: '2022-01-21', weekday: 5 },
      { contributionCount: 9, date: '2022-01-22', weekday: 6 },
    ],
    firstDay: '2022-01-16',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2022-01-09', weekday: 0 },
      { contributionCount: 6, date: '2022-01-10', weekday: 1 },
      { contributionCount: 8, date: '2022-01-11', weekday: 2 },
      { contributionCount: 13, date: '2022-01-12', weekday: 3 },
      { contributionCount: 13, date: '2022-01-13', weekday: 4 },
      { contributionCount: 3, date: '2022-01-14', weekday: 5 },
      { contributionCount: 0, date: '2022-01-15', weekday: 6 },
    ],
    firstDay: '2022-01-09',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2022-01-02', weekday: 0 },
      { contributionCount: 1, date: '2022-01-03', weekday: 1 },
      { contributionCount: 7, date: '2022-01-04', weekday: 2 },
      { contributionCount: 2, date: '2022-01-05', weekday: 3 },
      { contributionCount: 6, date: '2022-01-06', weekday: 4 },
      { contributionCount: 8, date: '2022-01-07', weekday: 5 },
      { contributionCount: 0, date: '2022-01-08', weekday: 6 },
    ],
    firstDay: '2022-01-02',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-12-26', weekday: 0 },
      { contributionCount: 7, date: '2021-12-27', weekday: 1 },
      { contributionCount: 20, date: '2021-12-28', weekday: 2 },
      { contributionCount: 6, date: '2021-12-29', weekday: 3 },
      { contributionCount: 10, date: '2021-12-30', weekday: 4 },
      { contributionCount: 20, date: '2021-12-31', weekday: 5 },
      { contributionCount: 3, date: '2022-01-01', weekday: 6 },
    ],
    firstDay: '2021-12-26',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-12-19', weekday: 0 },
      { contributionCount: 17, date: '2021-12-20', weekday: 1 },
      { contributionCount: 11, date: '2021-12-21', weekday: 2 },
      { contributionCount: 25, date: '2021-12-22', weekday: 3 },
      { contributionCount: 13, date: '2021-12-23', weekday: 4 },
      { contributionCount: 9, date: '2021-12-24', weekday: 5 },
      { contributionCount: 0, date: '2021-12-25', weekday: 6 },
    ],
    firstDay: '2021-12-19',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-12-12', weekday: 0 },
      { contributionCount: 6, date: '2021-12-13', weekday: 1 },
      { contributionCount: 12, date: '2021-12-14', weekday: 2 },
      { contributionCount: 15, date: '2021-12-15', weekday: 3 },
      { contributionCount: 15, date: '2021-12-16', weekday: 4 },
      { contributionCount: 25, date: '2021-12-17', weekday: 5 },
      { contributionCount: 0, date: '2021-12-18', weekday: 6 },
    ],
    firstDay: '2021-12-12',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-12-05', weekday: 0 },
      { contributionCount: 6, date: '2021-12-06', weekday: 1 },
      { contributionCount: 10, date: '2021-12-07', weekday: 2 },
      { contributionCount: 11, date: '2021-12-08', weekday: 3 },
      { contributionCount: 7, date: '2021-12-09', weekday: 4 },
      { contributionCount: 17, date: '2021-12-10', weekday: 5 },
      { contributionCount: 4, date: '2021-12-11', weekday: 6 },
    ],
    firstDay: '2021-12-05',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-11-28', weekday: 0 },
      { contributionCount: 17, date: '2021-11-29', weekday: 1 },
      { contributionCount: 21, date: '2021-11-30', weekday: 2 },
      { contributionCount: 13, date: '2021-12-01', weekday: 3 },
      { contributionCount: 13, date: '2021-12-02', weekday: 4 },
      { contributionCount: 14, date: '2021-12-03', weekday: 5 },
      { contributionCount: 0, date: '2021-12-04', weekday: 6 },
    ],
    firstDay: '2021-11-28',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-11-21', weekday: 0 },
      { contributionCount: 1, date: '2021-11-22', weekday: 1 },
      { contributionCount: 9, date: '2021-11-23', weekday: 2 },
      { contributionCount: 2, date: '2021-11-24', weekday: 3 },
      { contributionCount: 4, date: '2021-11-25', weekday: 4 },
      { contributionCount: 16, date: '2021-11-26', weekday: 5 },
      { contributionCount: 0, date: '2021-11-27', weekday: 6 },
    ],
    firstDay: '2021-11-21',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-11-14', weekday: 0 },
      { contributionCount: 8, date: '2021-11-15', weekday: 1 },
      { contributionCount: 10, date: '2021-11-16', weekday: 2 },
      { contributionCount: 12, date: '2021-11-17', weekday: 3 },
      { contributionCount: 6, date: '2021-11-18', weekday: 4 },
      { contributionCount: 1, date: '2021-11-19', weekday: 5 },
      { contributionCount: 0, date: '2021-11-20', weekday: 6 },
    ],
    firstDay: '2021-11-14',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-11-07', weekday: 0 },
      { contributionCount: 13, date: '2021-11-08', weekday: 1 },
      { contributionCount: 8, date: '2021-11-09', weekday: 2 },
      { contributionCount: 7, date: '2021-11-10', weekday: 3 },
      { contributionCount: 12, date: '2021-11-11', weekday: 4 },
      { contributionCount: 2, date: '2021-11-12', weekday: 5 },
      { contributionCount: 0, date: '2021-11-13', weekday: 6 },
    ],
    firstDay: '2021-11-07',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-10-31', weekday: 0 },
      { contributionCount: 5, date: '2021-11-01', weekday: 1 },
      { contributionCount: 0, date: '2021-11-02', weekday: 2 },
      { contributionCount: 7, date: '2021-11-03', weekday: 3 },
      { contributionCount: 14, date: '2021-11-04', weekday: 4 },
      { contributionCount: 8, date: '2021-11-05', weekday: 5 },
      { contributionCount: 3, date: '2021-11-06', weekday: 6 },
    ],
    firstDay: '2021-10-31',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-10-24', weekday: 0 },
      { contributionCount: 2, date: '2021-10-25', weekday: 1 },
      { contributionCount: 2, date: '2021-10-26', weekday: 2 },
      { contributionCount: 5, date: '2021-10-27', weekday: 3 },
      { contributionCount: 0, date: '2021-10-28', weekday: 4 },
      { contributionCount: 0, date: '2021-10-29', weekday: 5 },
      { contributionCount: 0, date: '2021-10-30', weekday: 6 },
    ],
    firstDay: '2021-10-24',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-10-17', weekday: 0 },
      { contributionCount: 0, date: '2021-10-18', weekday: 1 },
      { contributionCount: 0, date: '2021-10-19', weekday: 2 },
      { contributionCount: 0, date: '2021-10-20', weekday: 3 },
      { contributionCount: 0, date: '2021-10-21', weekday: 4 },
      { contributionCount: 0, date: '2021-10-22', weekday: 5 },
      { contributionCount: 0, date: '2021-10-23', weekday: 6 },
    ],
    firstDay: '2021-10-17',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-10-10', weekday: 0 },
      { contributionCount: 0, date: '2021-10-11', weekday: 1 },
      { contributionCount: 0, date: '2021-10-12', weekday: 2 },
      { contributionCount: 0, date: '2021-10-13', weekday: 3 },
      { contributionCount: 0, date: '2021-10-14', weekday: 4 },
      { contributionCount: 0, date: '2021-10-15', weekday: 5 },
      { contributionCount: 0, date: '2021-10-16', weekday: 6 },
    ],
    firstDay: '2021-10-10',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-10-03', weekday: 0 },
      { contributionCount: 0, date: '2021-10-04', weekday: 1 },
      { contributionCount: 0, date: '2021-10-05', weekday: 2 },
      { contributionCount: 0, date: '2021-10-06', weekday: 3 },
      { contributionCount: 0, date: '2021-10-07', weekday: 4 },
      { contributionCount: 0, date: '2021-10-08', weekday: 5 },
      { contributionCount: 0, date: '2021-10-09', weekday: 6 },
    ],
    firstDay: '2021-10-03',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-09-26', weekday: 0 },
      { contributionCount: 0, date: '2021-09-27', weekday: 1 },
      { contributionCount: 0, date: '2021-09-28', weekday: 2 },
      { contributionCount: 0, date: '2021-09-29', weekday: 3 },
      { contributionCount: 0, date: '2021-09-30', weekday: 4 },
      { contributionCount: 0, date: '2021-10-01', weekday: 5 },
      { contributionCount: 0, date: '2021-10-02', weekday: 6 },
    ],
    firstDay: '2021-09-26',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-09-19', weekday: 0 },
      { contributionCount: 0, date: '2021-09-20', weekday: 1 },
      { contributionCount: 0, date: '2021-09-21', weekday: 2 },
      { contributionCount: 0, date: '2021-09-22', weekday: 3 },
      { contributionCount: 0, date: '2021-09-23', weekday: 4 },
      { contributionCount: 0, date: '2021-09-24', weekday: 5 },
      { contributionCount: 0, date: '2021-09-25', weekday: 6 },
    ],
    firstDay: '2021-09-19',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-09-12', weekday: 0 },
      { contributionCount: 2, date: '2021-09-13', weekday: 1 },
      { contributionCount: 0, date: '2021-09-14', weekday: 2 },
      { contributionCount: 0, date: '2021-09-15', weekday: 3 },
      { contributionCount: 0, date: '2021-09-16', weekday: 4 },
      { contributionCount: 0, date: '2021-09-17', weekday: 5 },
      { contributionCount: 0, date: '2021-09-18', weekday: 6 },
    ],
    firstDay: '2021-09-12',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-09-05', weekday: 0 },
      { contributionCount: 6, date: '2021-09-06', weekday: 1 },
      { contributionCount: 2, date: '2021-09-07', weekday: 2 },
      { contributionCount: 2, date: '2021-09-08', weekday: 3 },
      { contributionCount: 0, date: '2021-09-09', weekday: 4 },
      { contributionCount: 0, date: '2021-09-10', weekday: 5 },
      { contributionCount: 0, date: '2021-09-11', weekday: 6 },
    ],
    firstDay: '2021-09-05',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-08-29', weekday: 0 },
      { contributionCount: 0, date: '2021-08-30', weekday: 1 },
      { contributionCount: 0, date: '2021-08-31', weekday: 2 },
      { contributionCount: 0, date: '2021-09-01', weekday: 3 },
      { contributionCount: 3, date: '2021-09-02', weekday: 4 },
      { contributionCount: 0, date: '2021-09-03', weekday: 5 },
      { contributionCount: 0, date: '2021-09-04', weekday: 6 },
    ],
    firstDay: '2021-08-29',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-08-22', weekday: 0 },
      { contributionCount: 0, date: '2021-08-23', weekday: 1 },
      { contributionCount: 0, date: '2021-08-24', weekday: 2 },
      { contributionCount: 1, date: '2021-08-25', weekday: 3 },
      { contributionCount: 0, date: '2021-08-26', weekday: 4 },
      { contributionCount: 0, date: '2021-08-27', weekday: 5 },
      { contributionCount: 0, date: '2021-08-28', weekday: 6 },
    ],
    firstDay: '2021-08-22',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-08-15', weekday: 0 },
      { contributionCount: 0, date: '2021-08-16', weekday: 1 },
      { contributionCount: 2, date: '2021-08-17', weekday: 2 },
      { contributionCount: 6, date: '2021-08-18', weekday: 3 },
      { contributionCount: 0, date: '2021-08-19', weekday: 4 },
      { contributionCount: 0, date: '2021-08-20', weekday: 5 },
      { contributionCount: 0, date: '2021-08-21', weekday: 6 },
    ],
    firstDay: '2021-08-15',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-08-08', weekday: 0 },
      { contributionCount: 0, date: '2021-08-09', weekday: 1 },
      { contributionCount: 0, date: '2021-08-10', weekday: 2 },
      { contributionCount: 0, date: '2021-08-11', weekday: 3 },
      { contributionCount: 0, date: '2021-08-12', weekday: 4 },
      { contributionCount: 0, date: '2021-08-13', weekday: 5 },
      { contributionCount: 0, date: '2021-08-14', weekday: 6 },
    ],
    firstDay: '2021-08-08',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-08-01', weekday: 0 },
      { contributionCount: 0, date: '2021-08-02', weekday: 1 },
      { contributionCount: 0, date: '2021-08-03', weekday: 2 },
      { contributionCount: 0, date: '2021-08-04', weekday: 3 },
      { contributionCount: 0, date: '2021-08-05', weekday: 4 },
      { contributionCount: 0, date: '2021-08-06', weekday: 5 },
      { contributionCount: 0, date: '2021-08-07', weekday: 6 },
    ],
    firstDay: '2021-08-01',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-07-25', weekday: 0 },
      { contributionCount: 0, date: '2021-07-26', weekday: 1 },
      { contributionCount: 0, date: '2021-07-27', weekday: 2 },
      { contributionCount: 0, date: '2021-07-28', weekday: 3 },
      { contributionCount: 0, date: '2021-07-29', weekday: 4 },
      { contributionCount: 0, date: '2021-07-30', weekday: 5 },
      { contributionCount: 0, date: '2021-07-31', weekday: 6 },
    ],
    firstDay: '2021-07-25',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-07-18', weekday: 0 },
      { contributionCount: 0, date: '2021-07-19', weekday: 1 },
      { contributionCount: 0, date: '2021-07-20', weekday: 2 },
      { contributionCount: 0, date: '2021-07-21', weekday: 3 },
      { contributionCount: 0, date: '2021-07-22', weekday: 4 },
      { contributionCount: 0, date: '2021-07-23', weekday: 5 },
      { contributionCount: 0, date: '2021-07-24', weekday: 6 },
    ],
    firstDay: '2021-07-18',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-07-11', weekday: 0 },
      { contributionCount: 0, date: '2021-07-12', weekday: 1 },
      { contributionCount: 2, date: '2021-07-13', weekday: 2 },
      { contributionCount: 0, date: '2021-07-14', weekday: 3 },
      { contributionCount: 0, date: '2021-07-15', weekday: 4 },
      { contributionCount: 0, date: '2021-07-16', weekday: 5 },
      { contributionCount: 0, date: '2021-07-17', weekday: 6 },
    ],
    firstDay: '2021-07-11',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-07-04', weekday: 0 },
      { contributionCount: 0, date: '2021-07-05', weekday: 1 },
      { contributionCount: 0, date: '2021-07-06', weekday: 2 },
      { contributionCount: 0, date: '2021-07-07', weekday: 3 },
      { contributionCount: 0, date: '2021-07-08', weekday: 4 },
      { contributionCount: 0, date: '2021-07-09', weekday: 5 },
      { contributionCount: 0, date: '2021-07-10', weekday: 6 },
    ],
    firstDay: '2021-07-04',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-06-27', weekday: 0 },
      { contributionCount: 0, date: '2021-06-28', weekday: 1 },
      { contributionCount: 0, date: '2021-06-29', weekday: 2 },
      { contributionCount: 0, date: '2021-06-30', weekday: 3 },
      { contributionCount: 0, date: '2021-07-01', weekday: 4 },
      { contributionCount: 0, date: '2021-07-02', weekday: 5 },
      { contributionCount: 0, date: '2021-07-03', weekday: 6 },
    ],
    firstDay: '2021-06-27',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-06-20', weekday: 0 },
      { contributionCount: 0, date: '2021-06-21', weekday: 1 },
      { contributionCount: 0, date: '2021-06-22', weekday: 2 },
      { contributionCount: 0, date: '2021-06-23', weekday: 3 },
      { contributionCount: 0, date: '2021-06-24', weekday: 4 },
      { contributionCount: 0, date: '2021-06-25', weekday: 5 },
      { contributionCount: 0, date: '2021-06-26', weekday: 6 },
    ],
    firstDay: '2021-06-20',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-06-13', weekday: 0 },
      { contributionCount: 0, date: '2021-06-14', weekday: 1 },
      { contributionCount: 1, date: '2021-06-15', weekday: 2 },
      { contributionCount: 0, date: '2021-06-16', weekday: 3 },
      { contributionCount: 0, date: '2021-06-17', weekday: 4 },
      { contributionCount: 0, date: '2021-06-18', weekday: 5 },
      { contributionCount: 0, date: '2021-06-19', weekday: 6 },
    ],
    firstDay: '2021-06-13',
  },
  {
    contributionDays: [
      { contributionCount: 0, date: '2021-06-06', weekday: 0 },
      { contributionCount: 0, date: '2021-06-07', weekday: 1 },
      { contributionCount: 3, date: '2021-06-08', weekday: 2 },
      { contributionCount: 2, date: '2021-06-09', weekday: 3 },
      { contributionCount: 0, date: '2021-06-10', weekday: 4 },
      { contributionCount: 0, date: '2021-06-11', weekday: 5 },
      { contributionCount: 0, date: '2021-06-12', weekday: 6 },
    ],
    firstDay: '2021-06-06',
  },
]
  .reverse()
  .slice(5);
const xAxisData = originalData.map((d) => d.firstDay);
const yAxisData = [0, 1, 2, 3, 4, 5, 6];
const colors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196027'];

const data = originalData.reduce((res, curr) => {
  const weekData = [];
  for (let i = 0; i < 6; i++) {
    const day = curr.contributionDays.find((d) => d.weekday === i);
    weekData.push([curr.firstDay, i, day ? day.contributionCount || 0 : 0]);
  }
  return [...res, ...weekData];
}, []);

const base = 5;

const hideAxisOption = {
  name: '',
  axisTick: { show: false },
  splitLine: { show: false },
  axisLabel: { show: false },
  axisLine: { lineStyle: { opacity: 0 } },
  show: false,
};

option = {
  tooltip: {},
  visualMap: {
    max: 40,
    inRange: {
      color: colors,
    },
  },
  xAxis3D: {
    type: 'category',
    data: xAxisData,
    ...hideAxisOption,
  },
  yAxis3D: {
    type: 'category',
    data: yAxisData,
    ...hideAxisOption,
  },
  zAxis3D: {
    type: 'value',
    ...hideAxisOption,
  },
  grid3D: {
    boxWidth: base * originalData.length,
    boxDepth: base * 7,
    viewControl: {
      // projection: 'orthographic'
    },
    light: {
      main: {
        intensity: 1.2,
        shadow: true,
      },
      ambient: {
        intensity: 0.3,
      },
    },
  },
  series: [
    {
      type: 'bar3D',
      data: data.map(function (item) {
        return {
          value: [item[0], item[1], item[2]],
        };
      }),
      itemStyle: {
        opacity: 0.99,
      },
    },
  ],
};
console.log(option);
