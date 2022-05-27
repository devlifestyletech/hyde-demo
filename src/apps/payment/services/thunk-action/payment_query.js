const paymentQuery = (params) => {
	let coditionData = {
		status: false,
		content: null,
	};
	if (params !== undefined) {
		if (params.Status_Billpayment !== undefined) {
			coditionData.content = `users_permissions_user.Status_Billpayment=true`;
		}
		if (params.status !== undefined) {
			coditionData.content = `BillsPayment_Status=${params.status}`;
		}
		if (params.defaultPage !== undefined) {
			if (coditionData.content === null) {
				coditionData.content = `_start=${params.defaultPage === 1 ? params.defaultPage - 1 : params.defaultPage * params.pagesize - 1}`;
			} else {
				coditionData.content += `&_start=${params.defaultPage === 1 ? params.defaultPage - 1 : params.defaultPage * params.pagesize - 1}`;
			}
		}
		if (params.pagesize !== undefined) {
			coditionData.content += `&_limit=${params.pagesize}`;
		}
		// data table payment query
		if (params.filters !== undefined) {
			const { BillsPayment_Invoice, Address_Customer, Name_Customer, Total_BillsPayment, createBill } = params.filters;
			if (BillsPayment_Invoice !== null && BillsPayment_Invoice !== undefined) {
				coditionData.content += `&BillsPayment_Invoice_contains=${BillsPayment_Invoice}`;
			}
			if (Address_Customer !== null && Address_Customer !== undefined) {
				coditionData.content += `&Address_Customer_contains=${Address_Customer}`;
			}
			if (Name_Customer !== null && Name_Customer !== undefined) {
				coditionData.content += `&Name_Customer_contains=${Name_Customer}`;
			}
			if (Total_BillsPayment !== null && Total_BillsPayment !== undefined) {
				coditionData.content += `&Total_BillsPayment_gte=${Total_BillsPayment}`;
			}
			if (createBill !== undefined) {
				coditionData.content += `&_createBill_eq=${createBill[0]}&_createBill_lte=${createBill[1]}`;
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

const CustomerQuery = (params) => {
	let coditionData = {
		status: false,
		content: null,
	};
	if (params !== undefined) {
		coditionData.content = `Status_billpayment=true`;

		if (params.defaultPage !== undefined) {
			coditionData.content += `&_start=${params.defaultPage === 1 ? params.defaultPage - 1 : params.defaultPage * params.pagesize - 1}`;
		}
		if (params.pagesize !== undefined) {
			coditionData.content += `&_limit=${params.pagesize}`;
		}
		// data table payment query
		if (params.filters !== undefined) {
			const { Address_Customer, Total_BillsPayment, createBill } = params.filters;

			if (Address_Customer !== null && Address_Customer !== undefined) {
				coditionData.content += `&address_contains=${Address_Customer}`;
			}

			if (Total_BillsPayment !== null && Total_BillsPayment !== undefined) {
				coditionData.content += `&Total_BillsPayment_gte=${Total_BillsPayment}`;
			}
			if (createBill !== undefined) {
				coditionData.content += `&_createBill_eq=${createBill[0]}&_createBill_lte=${createBill[1]}`;
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
export { paymentQuery, CustomerQuery };
