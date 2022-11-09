// this is just an example file to show how to use api file
// this project does not install react
import * as React from "react";
import { deleteAttachmentUsingDeleteRequest, useDownloadUsingGetRequest } from "./request/api";

const Page = async () => {
  // for get request
  // the first param will be request params
  // the second param will be swrConfig
  const { data } = useDownloadUsingGetRequest({ id: "id" }, {});

  // for other requests will use axios to send request
  const response = await deleteAttachmentUsingDeleteRequest({id: "id"});

  return (
    <YourComponment>{data}</YourComponment>
    <YourComponment>{response}</YourComponment>
  );
};
