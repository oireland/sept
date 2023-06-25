import React from "react";
import axios from "axios";
import getURL from "@/lib/getURL";

const Confirm = async ({ params }: { params: { token: string } }) => {
  let isSuccessful = false;
  try {
    const res = await axios.patch(getURL("/api/auth/verifyUser"), {
      token: params.token,
    });
    console.log(res.data);
    isSuccessful = true;
  } catch (e) {
    console.log(e);
  }

  return <div>{isSuccessful ? <p>Success!</p> : <p>Not Successfull!</p>}</div>;
};

export default Confirm;
