import {
  Button,
  List,
  Progress,
  Segment,
  SemanticICONS,
} from 'semantic-ui-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import useFetch from '../lib/data/_useFetch';
import { isEmpty } from 'lodash';
import getFileSize from '../lib/util/getFileSize';
import ReactCrop, {
  centerCrop,
  Crop,
  makeAspectCrop,
  PixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
// import { canvasPreview } from './upload/CanvasPreview';

const TO_RADIANS = Math.PI / 180;

type File = {
  name: string;
  size: string | number;
  icon?: SemanticICONS;
};

type InputImageCropProps = {
  multiple?: boolean;
  uploadFetcher?: any;
  downloadFormatFetcher?: any;
  onUploadSuccess?: any;
  accept?: string;
  extraBody?: any;
  uploadButtonText?: string;
  onClose: any;
};

const MAP_FILE_ICON: any = {
  'application/excel': 'file excel',
  'application/zip': 'file archive',
  'image/jpeg': 'file image',
  // TODO: add more icon mapper
};

const InputImageCrop = ({
  multiple = false,
  uploadFetcher,
  downloadFormatFetcher,
  onUploadSuccess,
  accept,
  extraBody,
  uploadButtonText,
  onClose,
}: InputImageCropProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [blobFiles, setBlobFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [src, setSrc] = useState<any>();
  const [crop, setCrop] = useState<Crop>({
    unit: '%', // Can be 'px' or '%'
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [showCrop, setShowCrop] = useState(false);

  const onError = useCallback((error) => {
    toast.error(
      error.response?.data?.message ||
        'Something went when uploading your file',
    );
  }, []);

  const { data, isLoading, fetch } = useFetch({
    fetcher: uploadFetcher,
    onError,
  });

  const fileInput = useRef<HTMLInputElement>();

  const onFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      setFiles([
        {
          name: file.name,
          size: getFileSize(file.size),
          icon: MAP_FILE_ICON[file.type] || 'file',
        },
      ]);
      setBlobFiles([file]);
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      e.target.value = null;
    },
    [multiple],
  );

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (!e.currentTarget) {
      return;
    }

    imgRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;

    // This is to demonstate how to make and center a % aspect crop
    // which is a bit trickier so we use some helper functions.
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1 / 1,
        width,
        height,
      ),
      width,
      height,
    );

    setCrop(crop);
  }

  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      // We use canvasPreview as it's much faster than imgPreview.
      canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      // console.log({ result, blobFiles });
    }
  }, [completedCrop]);

  const onAddFilePress = useCallback(() => {
    fileInput.current?.click();
  }, [fileInput]);

  const onRemoveFilePress = useCallback(
    (index) => () => {
      setFiles((files) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        return newFiles;
      });
      setBlobFiles((blobFiles) => {
        const newBlobFiles = [...blobFiles];
        newBlobFiles.splice(index, 1);
        return newBlobFiles;
      });
    },
    [],
  );

  const onRemoveAllFile = useCallback(() => {
    setFiles([]);
    setBlobFiles([]);
  }, []);

  const _onUploadPress = useCallback(() => {
    fetch(
      blobFiles,
      (progressEvent: ProgressEvent) => {
        setUploadProgress(
          Math.round((100 * progressEvent.loaded) / progressEvent.total),
        );
      },
      extraBody,
    );
    toast.success('Successfully upload your files');
    onClose();
  }, [fetch, blobFiles]);

  const [addFileText, addFileIcon] = useMemo(() => {
    return files.length > 0
      ? multiple
        ? ['Add More File', 'plus']
        : ['Change File', 'exchange']
      : ['Choose File', 'hand lizard'];
  }, [multiple, files]);

  useEffect(() => {
    // console.log({ onUploadSuccess });
    if (data) {
      setFiles([]);
      setBlobFiles([]);
    }
  }, [onUploadSuccess, data]);

  const handleShowCropped = useCallback(() => {
    setShowCrop(true);
  }, []);

  async function canvasPreview(
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: PixelCrop,
    scale = 1,
    rotate = 0,
  ) {
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    // devicePixelRatio slightly increases sharpness on retina devices
    // at the expense of slightly slower render times and needing to
    // size the image back down if you want to download/upload and be
    // true to the images natural size.
    const pixelRatio = window.devicePixelRatio;
    // const pixelRatio = 1

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    const rotateRads = rotate * TO_RADIANS;
    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();

    // 5) Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY);
    // 4) Move the origin to the center of the original position
    ctx.translate(centerX, centerY);
    // 3) Rotate around the origin
    ctx.rotate(rotateRads);
    // 2) Scale the image
    ctx.scale(scale, scale);
    // 1) Move the center of the image to the origin (0,0)
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
    );

    ctx.restore();

    // const base64Image = canvas.toDataURL('image/jpeg', 1);
    canvas.toBlob((blob: any) => {
      const newFile = new File([blob], 'profile.jpeg', {
        type: 'image/jpeg',
      });
      setBlobFiles([newFile]);
    });

    // console.log(result);
  }

  return (
    <>
      <Button
        disabled={isLoading}
        loading={isLoading}
        onClick={onAddFilePress}
        icon={addFileIcon}
        content={addFileText}
        basic
        size={'small'}
        compact
      />
      {downloadFormatFetcher && (
        <Button
          onClick={downloadFormatFetcher}
          icon={'download'}
          content={'Download Format'}
          basic
          size={'small'}
          compact
        />
      )}
      {!isEmpty(files) && blobFiles && (
        <Button
          primary
          disabled={isLoading}
          loading={isLoading}
          onClick={_onUploadPress}
          icon={'upload'}
          content={uploadButtonText || 'Upload'}
          size={'small'}
          compact
        />
      )}
      {files.length > 1 && (
        <Button
          disabled={isLoading}
          loading={isLoading}
          onClick={onRemoveAllFile}
          icon={'trash'}
          content={'Remove All'}
          basic
          size={'small'}
          compact
          floated={'right'}
        />
      )}
      <input
        multiple={multiple}
        ref={fileInput as any}
        type="file"
        hidden
        onChange={onFileChange}
        accept={accept}
      />
      <List relaxed selection>
        {files.map((file, index) => (
          <List.Item key={`${index}-${file.name}`}>
            <List.Content floated="right" verticalAlign={'middle'}>
              <Button
                onClick={onRemoveFilePress(index)}
                icon={'close'}
                basic
                compact
                size={'mini'}
                disabled={isLoading}
                loading={isLoading}
              />
            </List.Content>
            <List.Icon name={file.icon} size="large" verticalAlign="middle" />
            <List.Content>
              <List.Header>{file.name}</List.Header>
              <List.Description>{file.size}</List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Progress percent={uploadProgress} size={'tiny'} indicating />
      )}
      {!showCrop && src && (
        <Segment>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1 / 1}
          >
            <img src={src} onLoad={onImageLoad} />
          </ReactCrop>
          <Button
            onClick={handleShowCropped}
            icon={'crop'}
            primary
            basic
            compact
            content={'Crop Image'}
            disabled={isLoading}
            loading={isLoading}
          />
        </Segment>
      )}

      {completedCrop && (
        <Segment textAlign="center">
          <canvas
            ref={previewCanvasRef}
            style={{
              border: '1px solid black',
              objectFit: 'contain',
              width: completedCrop?.width,
              height: completedCrop?.height,
            }}
          />
        </Segment>
      )}
    </>
  );
};

export default InputImageCrop;
