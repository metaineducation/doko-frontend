import { ajaxGateway } from "../http";

/**
 * PUT方式文件上传
 * @options
 *  fileList [{fileName = '', file = DOM element}, ...]
 *  purpose 指示此次需要上传的文件要为哪个API服务。该信息用于文件的信息提示，若有多个用逗号','分开. 长度不能超过255。purpose用于标识待上传的文件的具体用途，为未来管理和跟踪所有客户端上传的文件提供数据支持。注意，purpose会标示到filenames中指定的每一个文件上
 *  onProgress
 *  onSuccess
 *  onError
 */
export async function putFile(options) {
  let { fileList, purpose, onSuccess, onError, onProgress } = options;
  if (!fileList.length || !purpose) {
    throw new Error("params error");
  }

  let filenames = fileList.map((item) => item.fileName);
  //获取ticket
  return ajaxGateway({
    mt: "file.requestS3UploadingTicket",
    data: {
      filenames: JSON.stringify(filenames),
      purpose,
    },
  }).then((res) => {
    if (
      res.state.code == 0 &&
      res.data &&
      Array.isArray(res.data.fileUploadingItemList)
    ) {
      res.data.fileUploadingItemList.forEach((item) => {
        console.log(item);
        let {
          urlForUploading = "", //用于上传文件的临时URL，客户端应使用HTTP PUT方法将文件上传到URL中。请求body为文件内容的二进制格式，请求HEADER为uploadingHeaders罗列的内容
          // path = "", //文件路径，文件将上传到OSS的此位置处。文件上传成功后，客户端应将此路径告知给相关后端。注意路径不以'/'开头
          uploadingHeaders = [], //客户端在发起HTTP PUT进行文件上传时需要设置的HEADER列表，每个元素一个HEADER
          originFilename = "", //客户端在请求凭据时使用的原始文件名，此凭据项仅用于上传filename指定的文件。客户端可使用此字段对凭据项和本地待上传文件进行配对
          cdnUrl = "", //文件上传后可以通过此CDN地址访问
        } = item;

        const index = filenames.indexOf(originFilename);
        if (index >= 0) {
          let option = {};
          let headers = {};
          uploadingHeaders.forEach((item) => (headers[item.name] = item.value));

          option.headers = headers;
          option.action = urlForUploading;
          option.method = "put";
          option.file = fileList[index].file;
          option.withCredentials = false;
          option.cdnUrl = cdnUrl;

          onProgress || (onProgress = () => {});
          // onProgress || (onProgress = (progress) => {});

          onError ||
            (onError = (xhr) => {
              console.log("upload err:", xhr.code);
            });

          onSuccess ||
            (onSuccess = () => {
              console.log("upload success:", { originFilename, cdnUrl });
            });

          option.onProgress = onProgress;
          option.onError = onError;
          option.onSuccess = onSuccess;

          upload(option);
        }
      });
    }
  });
}

//上传
function upload(option) {
  const xhr = new XMLHttpRequest();
  const action = option.action; // 上传远程地址
  const method = option.method;

  if (xhr.upload) {
    xhr.upload.onprogress = function (e) {
      if (e.total > 0) {
        e.percent = (e.loaded / e.total) * 100;
      }
      option.onProgress(e);
    };
  }

  let requestData = option.file;

  xhr.onerror = function (e) {
    option.onError(e);
  };

  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(xhr);
    }

    option.onSuccess({ cdnUrl: option.cdnUrl });
  };

  xhr.open(method, action, true);

  if (option.withCredentials && "withCredentials" in xhr) {
    xhr.withCredentials = true;
  }

  const headers = option.headers || {};

  for (let item in headers) {
    if (headers.hasOwnProperty(item) && headers[item] !== null) {
      xhr.setRequestHeader(item, headers[item]);
    }
  }

  xhr.send(requestData);

  return xhr;
}

// 将base64转换为文件
//调用
// let file = dataURLtoFile(base64Data, imgName);
export function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
