import { BsFiletypeCsv } from "react-icons/bs";
import { Button } from "./ui/button";
import { FieldAttributes, useField } from "formik";
import { useState } from "react";

type FileInputCsvProps = {
  fileRef: React.RefObject<HTMLInputElement>;
  label?: string;
  handleFileChange: (resultArray: string[]) => void;
} & FieldAttributes<{}>;

const FileInputCsv = ({
  handleFileChange,
  fileRef,
  label,
  ...props
}: FileInputCsvProps) => {
  const [field, meta] = useField(props);
  const [fileName, setFileName] = useState<String>();
  return (
    <div className="mb-2">
      <div className="flex flex-col">
        <label className="text-lg">{label}</label>
        <Button
          variant={"outline"}
          onClick={() => {
            fileRef.current?.click();
          }}
          type="button"
        >
          <div className="flex items-center gap-2">
            <h6>Choose a File</h6>
            <BsFiletypeCsv />
          </div>
          <input
            type="file"
            ref={fileRef}
            className="hidden"
            accept=".csv"
            name="file"
            onChange={(e) => {
              if (e.currentTarget.files && e.currentTarget.files.length !== 0) {
                console.log(e.currentTarget.files);
                setFileName(e.currentTarget.files[0].name);
                const fileReader = new FileReader();
                fileReader.readAsText(e.currentTarget.files[0]);
                fileReader.addEventListener("load", () => {
                  const resultArray = fileReader
                    .result!.toString()
                    .split(/\r?\n/);
                  handleFileChange(resultArray);
                });
              } else {
                setFileName(undefined);
                handleFileChange([]);
              }
            }}
            onBlur={field.onBlur}
          />
        </Button>
        <p className="text-xs text-gray-400">{fileName || "No File Chosen"}</p>
      </div>
      {meta.touched && meta.error ? (
        <div className="text-red-600">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FileInputCsv;
