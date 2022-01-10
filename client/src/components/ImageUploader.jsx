import React, { useRef, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import "./styles/ImageUploader.css";
import "../components/pages/Login/styles/Login.css";

const ImageUpload = (props) => {
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!props.file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(props.file);
  }, [props.file]);

  const pickedHandler = (event) => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      props.setFile(pickedFile);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="login-input-text">
      <div className="image-name-div">{!props.file ? null : props.file.name.length > 25 ? props.file.name.substring(0, 25) + "..." : props.file.name}</div>
      <div className="under-name-div">
        <Button variant="contained" component="label" >
          Upload Photo
          <input
            id={"hi"}
            ref={filePickerRef}
            type="file"
            accept=".jpg,.png,.jpeg"
            onChange={pickedHandler}
            hidden
          />
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
