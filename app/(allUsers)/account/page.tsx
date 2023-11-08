import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";
import Banner from "../../../components/banner";
import AccountForm from "./AccountForm";

const AccountPage = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <Banner text="My Account" />

      <div className="container mt-2">
        <AccountForm
          initialValues={{
            email: session!.user.email,
            name: session!.user.name!,
            newPassword: "",
            newPasswordRepeat: "",
            oldPassword: "",
          }}
        />
      </div>
    </div>
  );
};

export default AccountPage;
