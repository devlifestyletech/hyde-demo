export const BankNamecode = (code) => {
  switch (code) {
    case '002':
      return 'ธนาคารกรุงเทพ';
      break;
    case '004':
      return 'ธนาคารกสิกรไทย';
      break;
    case '014':
      return 'ธนาคารไทยพาณิชย์';
      break;
    default:
      return null;
  }
};


