const fixReportQuery = (params) => {
  let coditionData = {
    status: false,
    content: null,
  };
  const nowYear=new Date().getFullYear()
  if (params !== undefined) {
    coditionData.content = `submission_date_gte=${nowYear}-01-01&submission_date_lt=${
      parseInt(nowYear) + 1
    }-01-01`
   
    if (params.status !== undefined) {
      coditionData.content = `status=${params.status}`;
    }
    if (params.defaultPage !== undefined) {
      if(coditionData.content=== null){
        coditionData.content = `_start=${
          params.defaultPage === 1
              ? params.defaultPage - 1
              : ((params.defaultPage-1) * (parseInt(params.pagesize)+1))-1
      }`;
      }else{
        coditionData.content += `&_start=${
          params.defaultPage === 1
              ? params.defaultPage - 1
              : ((params.defaultPage-1) * (parseInt(params.pagesize)+1))-1
      }`;
      }
    
    }
    if (params.pagesize !== undefined) {
      coditionData.content += `&_limit=${params.pagesize}`;
    }
    // data table payment query
    if (params.filters !== undefined) {
      const {
        address_number,
        Name_Customer,
        Total_BillsPayment,
        createBill,
      } = params.filters;
      if (address_number !== null &&address_number !== undefined) {
        coditionData.content += `&address.address_number_contains=${address_number}`;
      }
      if (Name_Customer !== null &&Name_Customer !== undefined) {
        coditionData.content += `&Name_Customer_contains=${Name_Customer}`;
      }
      if (Total_BillsPayment !== null &&Total_BillsPayment !== undefined) {
        coditionData.content += `&Total_BillsPayment_gte=${Total_BillsPayment}`;
      }
      if (createBill !== undefined) {
        coditionData.content += `&_createBill_eq=${createBill[0]}&_createBill_lte=${createBill[1]}`;
      }
    }
    // data table payment query

    if (params.sorter !== undefined) {
      switch (params.sorter.NameSort) {
        case "owner":
          coditionData.content += `&_sort=${"informer.fullname"}:${params.sorter.orderSort.slice(0, -3)}`;
          break;
          case "address_number":
          coditionData.content += `&_sort=${"address.address_number"}:${params.sorter.orderSort.slice(0, -3)}`;
          break;
          case "tel":
          coditionData.content += `&_sort=${"informer.tel"}:${params.sorter.orderSort.slice(0, -3)}`;
          break;
        default:
          coditionData.content += `&_sort=${params.sorter.NameSort}:${params.sorter.orderSort.slice(0, -3)}`;
          break;
      }
    }

    coditionData.status = true;
    return coditionData;
  } else {
    return coditionData;
  }
};


export { fixReportQuery };