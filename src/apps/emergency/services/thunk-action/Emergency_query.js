const EmergencyQuery = (params) => {

  let coditionData = {
    status: false,
    content: null,
  };
  if (params !== undefined) {
    // if (params.Status_Billpayment !== undefined) {
    //   coditionData.content = `users_permissions_user.Status_Billpayment=true`;
    // }
    if (params.status !== undefined) {
      coditionData.content = `Type=${params.status}`;
    }
    if (params.defaultPage !== undefined &&params.status === undefined) {
      coditionData.content = `_start=${
          params.defaultPage === 1
              ? params.defaultPage - 1
              : params.defaultPage * params.pagesize
      }`;
    }
    if (params.defaultPage !== undefined &&params.status !== undefined) {
      coditionData.content += `&_start=${
          params.defaultPage === 1
              ? params.defaultPage - 1
              : params.defaultPage * params.pagesize
      }`;
    }
    if (params.pagesize !== undefined) {
      coditionData.content += `&_limit=${params.pagesize}`;
    }
    // data table payment query
    if (params.filters !== undefined) {
      const {
        Name
      } = params.filters;
      if (Name !== null&&Name !== undefined) {
        coditionData.content += `&Name_contains=${Name}`;
      }

    }
    // data table payment query

    if (params.sorter !== undefined) {
      coditionData.content += `&_sort=${params.sorter.NameSort}:${params.sorter.orderSort.slice(0, -3)}`;
    }

    coditionData.status = true;
    return coditionData;
  } else {
    return coditionData;
  }
};
export { EmergencyQuery };
