const WarrantyQuery = (params) => {
  console.log("WarrantyQuery:",params)
  let coditionData = {
    status: false,
    content: null,
  };
  if (params !== undefined) {
    if (params.defaultPage !== undefined) {
      coditionData.content = `_start=${
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
        address_no,
      } = params.filters;
      if (address_no !== null&&address_no !== undefined) {
        coditionData.content += `&address_no_contains=${address_no}`;
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
