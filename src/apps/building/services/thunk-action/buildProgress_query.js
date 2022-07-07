const buildingProgressQuery = (params) => {
    let coditionData = {
        status: false,
        content: null,
    };
    if (params !== undefined) {
       
        if (params.defaultPage !== undefined) {
            if(coditionData.content=== null){
              coditionData.content = `_start=${
                params.defaultPage === 1
                    ? params.defaultPage - 1
                    : (params.defaultPage * params.pagesize)-2
            }`;
            }else{
              coditionData.content += `&_start=${
                params.defaultPage === 1
                    ? params.defaultPage - 1
                    : (params.defaultPage * params.pagesize)-1
            }`;
            }
          
          }
        if (params.pagesize !== undefined) {
            coditionData.content += `&_limit=${params.pagesize}`;
        }
        // data table payment query
        if (params.filters !== undefined) {
            const {
                subject
            } = params.filters;
            if (subject !== null&&subject !== undefined) {
                coditionData.content += `&subject_contains=${subject}`;
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
export { buildingProgressQuery };
