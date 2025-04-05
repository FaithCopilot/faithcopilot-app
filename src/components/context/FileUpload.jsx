import { useState } from "react";

import { Button } from "@/components/buttons/Button";
import { toast } from "@/components/Toast";
//import { createData } from "@/api";

const createData = () => null;

const SelectCollection = ({ register }) => {
	//const { data: collections, error, isValidating } = useCollections();
	const collections = [
		"docs"
	];
	return(
		<>
			<input
				list="collection-list"
				{...register("collection", { required: true })}
				onChange={(e) => console.log(e.target.value)}
				className="inputs"
			/>
			<datalist id="collection-list">
				{collections.map(collection => (
					<option key={collection} value={collection} />
				))}
			</datalist>
		</>
	);
};

/*
// TODO: mutate?
  const onSubmit = async(data) => {
	};
  */

export const FileUploadModalContent = ({ dismiss }) => {
  //const { register, handleSubmit, formState: { errors } } = useForm();
	const register = () => {};
	const handleSubmit = () => {};
	const formState = { errors: {} };
  const [chunkContent, setChunkContent] = useState(null);
  const onSubmit = async(data) => {
    /*
    // handle initial submit (pre chunking options)
    if (chunkContent === null) {
      setChunkContent(
        <FileUploadChunkContent
          data={data}
          dismiss={dismiss}
        />
      );
      return;
    };
    // handle test submit
    // TODO:
    // handle final upload submit
    */
		const formData = new FormData();
		formData.append("collection", data.collection);
		formData.append("file", data.file[0]);
    const { error } = await createData(formData);
		if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again later"
      });
		} else {
      toast({ title: "File uploaded" });
		};
    dismiss();
		return;
  };
  return(
    <div className="flex flex-col space-y-4">
			<form
				onSubmit={handleSubmit(onSubmit)}
				encType="multipart/form-data"
				className="flex flex-col space-y-4"
			>
				<div className="flex flex-col space-y-2 mt-4">
					<span className="placeholders">Select an existing collection (or type to create a new one)</span>
					<SelectCollection register={register} />
				</div>
				<div className="flex flex-col space-y-2">
					<span className="placeholders">Supported File types: .pdf, .csv (any delimited text file), .md, .txt, .html, .png</span>
					<input
						type="file"
						name="zzfile"
						{...register("file", { required: true })}
						className="relative cursor-pointer inputs"
					/>
				</div>
        { chunkContent ? null : (
          <div className="ms-auto">
            <Button
              type="submit"
              label="Upload"
            />
          </div>
        )}
        {chunkContent}
			</form>    
    </div>
  );
};
