"use client";
import dynamic from "next/dynamic";

const PlusOutlined = dynamic(() => import("@ant-design/icons/PlusOutlined"));
const UploadOutlined = dynamic(
    () => import("@ant-design/icons/UploadOutlined")
);

export function CreateFolderModal() {
    return <></>;
}

// export function CreateFolderModal() {
//     const tree = useTree();
//     const [form] = useForm();
//     const [isLoading, loading] = useBoolean(false);
//     const [isOpen, open] = useBoolean(false);
//     const [image, setImage] = useState<File>();
//     const [uploadProgress, setProgress] = useState<number>();
//     const [messageApi, contextHolder] = useMessage();

//     const params = useParams();
//     const folderId = params.folderId;

//     function onOk() {
//         form.submit();
//     }

//     function onClose() {
//         setImage(undefined);
//         setProgress(undefined);
//         form.resetFields();
//         loading.off();
//         open.off();
//     }

//     async function handleSubmit(values: any) {
//         loading.on();

//         const folderName = values.folderName;
//         const parentFolderId = folderId;

//         fetch("/api/folders", {
//             method: "POST",
//             body: JSON.stringify({
//                 name: folderName,
//                 parent: parentFolderId,
//             }),
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         })
//             .then((res) => {
//                 if (res.ok) {
//                     tree.reload();
//                     messageApi.success("Created folder");
//                     onClose();
//                 } else {
//                     messageApi.error("An error occured");
//                     loading.off();
//                 }
//             })
//             .catch(() => {
//                 messageApi.error("An error occured");
//                 loading.off();
//             });
//     }

//     return (
//         <>
//             {contextHolder}
//             <AntButton icon={<PlusOutlined />} onClick={open.on}>
//                 New Folder
//             </AntButton>
//             <AntModal
//                 centered
//                 open={isOpen}
//                 title="Create a new folder"
//                 okText="Create Folder"
//                 onOk={onOk}
//                 onCancel={onClose}
//                 confirmLoading={isLoading}
//             >
//                 <AntForm
//                     form={form}
//                     requiredMark={false}
//                     layout="vertical"
//                     style={{ paddingTop: "24px", paddingBottom: "24px" }}
//                     onFinish={handleSubmit}
//                 >
//                     <AntFormItem
//                         label="Folder Name"
//                         name="folderName"
//                         rules={[
//                             {
//                                 message: "A folder name is required.",
//                                 async validator(_, value) {
//                                     if (
//                                         typeof value !== "string" ||
//                                         !value.trim().length
//                                     ) {
//                                         return Promise.reject();
//                                     }
//                                 },
//                             },
//                         ]}
//                     >
//                         <AntInput type="text" placeholder="My new folder" />
//                     </AntFormItem>
//                     <AntFormItem label="Featured Image">
//                         <AntSpace
//                             direction="vertical"
//                             style={{ width: "100%" }}
//                         >
//                             <AntUpload
//                                 showUploadList={false}
//                                 beforeUpload={(_, files) => {
//                                     setImage(files[0]);
//                                     return false;
//                                 }}
//                             >
//                                 <AntButton icon={<UploadOutlined />}>
//                                     Upload
//                                 </AntButton>
//                             </AntUpload>
//                             {image && (
//                                 <UploadFileItem
//                                     file={image}
//                                     progress={uploadProgress}
//                                     onRemove={() => setImage(undefined)}
//                                 />
//                             )}
//                         </AntSpace>
//                     </AntFormItem>
//                 </AntForm>
//             </AntModal>
//         </>
//     );
// }
