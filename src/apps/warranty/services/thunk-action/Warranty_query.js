const WarrantyQuery = (params) => {
  // console.log("WarrantyQuery:",params)
  let coditionData = {
    status: false,
    content: null,
    pageStart:0
  };
  if (params !== undefined) {
    if (params.defaultPage !== undefined) {
      coditionData.pageStart= params.defaultPage === 1
      ? params.defaultPage - 1
      : (params.defaultPage * params.pagesize-params.defaultPage)+(params.defaultPage - params.pagesize)
      coditionData.content = `_start=${
          params.defaultPage === 1
              ? params.defaultPage - 1
              : (params.defaultPage * params.pagesize-params.defaultPage)+(params.defaultPage - params.pagesize)
      }`;
    }
    if (params.pagesize !== undefined) {
      coditionData.content += `&_limit=${params.pagesize}`;
    }
    // data table payment query
    if (params.filters !== undefined) {
      const {
        address_number,
      } = params.filters;
      if (address_number !== null&&address_number !== undefined) {
        coditionData.content += `&address_number_contains=${address_number}`;
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
export { WarrantyQuery };
