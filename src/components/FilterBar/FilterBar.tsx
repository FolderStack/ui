"use client";

export function FilterBar() {
    return <>Filter Bar</>;
}

// export function FilterBar() {
//     const [form] = useForm();
//     const filter = useFilter();

//     const to = useWatch("to", form);
//     const from = useWatch("from", form);
//     const fileTypes = useWatch("fileTypes", form);

//     const [messageApi, contextHolder] = useMessage();

//     function applyFilter(values: any) {
//         if (values.to) {
//             values.to = values.to.toDate();
//         }

//         if (values.from) {
//             values.from = values.from.toDate();
//         }

//         filter.apply(values);

//         messageApi.open({ type: "success", content: "Filters applied" });
//     }

//     function resetFilter() {
//         form.resetFields(["from", "to", "fileTypes"]);
//         filter.clear();
//     }

//     const hasFilterValues = useMemo(() => {
//         return from || to || !!fileTypes?.length;
//     }, [from, to, fileTypes]);

//     useEffect(() => {
//         const _to = filter.filter.to;
//         const _from = filter.filter.from;
//         const _fileTypes = filter.filter.fileTypes;

//         if (_to) {
//             form.setFieldValue("to", dayjs(_to.toISOString()));
//         }

//         if (_from) {
//             form.setFieldValue("from", dayjs(_from.toISOString()));
//         }

//         if (_fileTypes) {
//             form.setFieldValue("fileTypes", _fileTypes);
//         }
//     }, [filter, form]);

//     if (!filter.isVisible) return null;

//     return (
//         <AntRow>
//             {contextHolder}
//             <AntForm
//                 form={form}
//                 layout="vertical"
//                 name="filter"
//                 onFinish={applyFilter}
//                 style={{
//                     display: "flex",
//                     flexDirection: "row",
//                     columnGap: "16px",
//                     flexWrap: "wrap",
//                 }}
//             >
//                 <AntFormItem
//                     label="Filter from"
//                     name="from"
//                     style={{ marginBottom: "8px" }}
//                 >
//                     <AntDatePicker
//                         format="DD/MM/YYYY"
//                         size="large"
//                         style={{ minWidth: "160px" }}
//                     />
//                 </AntFormItem>
//                 <AntFormItem
//                     label="Filter to"
//                     name="to"
//                     style={{ marginBottom: "8px" }}
//                 >
//                     <AntDatePicker
//                         format="DD/MM/YYYY"
//                         size="large"
//                         style={{ minWidth: "160px" }}
//                     />
//                 </AntFormItem>
//                 <AntFormItem
//                     label="File types"
//                     name="fileTypes"
//                     style={{ marginBottom: "8px" }}
//                 >
//                     <AntSelect
//                         showSearch
//                         size="large"
//                         placeholder="Select file types"
//                         mode="multiple"
//                         defaultActiveFirstOption={false}
//                         showArrow={false}
//                         notFoundContent={null}
//                         options={OPTIONS}
//                         style={{ minWidth: "180px", maxWidth: "300px" }}
//                     />
//                 </AntFormItem>
//                 <AntFormItem label=" ">
//                     <AntTooltip
//                         title={
//                             hasFilterValues
//                                 ? "Filter the items on this page"
//                                 : "Select filters to apply"
//                         }
//                     >
//                         <AntButton
//                             htmlType="submit"
//                             size="large"
//                             disabled={!hasFilterValues}
//                         >
//                             Apply Filters
//                         </AntButton>
//                     </AntTooltip>
//                 </AntFormItem>
//                 <AntFormItem label=" ">
//                     <AntTooltip
//                         title={
//                             hasFilterValues ? "Clear & reset the filters" : ""
//                         }
//                     >
//                         <AntButton
//                             size="large"
//                             danger
//                             onClick={resetFilter}
//                             disabled={!hasFilterValues}
//                         >
//                             Clear
//                         </AntButton>
//                     </AntTooltip>
//                 </AntFormItem>
//             </AntForm>
//         </AntRow>
//     );
// }

// const OPTIONS = [
//     {
//         label: "ai",
//         value: "ai",
//     },
//     {
//         label: "csv",
//         value: "csv",
//     },
//     {
//         label: "gif",
//         value: "gif",
//     },
//     {
//         label: "jpg",
//         value: "jpg",
//     },
//     {
//         label: "mov",
//         value: "mov",
//     },
//     {
//         label: "mp4",
//         value: "mp4",
//     },
//     {
//         label: "pdf",
//         value: "pdf",
//     },
//     {
//         label: "png",
//         value: "png",
//     },
//     {
//         label: "psd",
//         value: "psd",
//     },
//     {
//         label: "xlsx",
//         value: "xlsx",
//     },
//     {
//         label: "zip",
//         value: "zip",
//     },
// ];
