import { FC } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "./FormikInput";
import FormNavigationButton from "./SubmitButton";
import axios from "axios";
import PasswordField from "./FormikPasswordField";
import { HiOutlineLibrary, HiAtSymbol } from "react-icons/hi";
import { UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

const validationSchema: Yup.ObjectSchema<FormData> = Yup.object().shape({
  name: Yup.string().required("Organisation name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: Yup.string()
    .matches(
      /(?=^.{8,20}$)((?=.*\w)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[|!"$%&\/\(\)\?\^\'\\\+\-\*]))^.*/,
      "At least one: uppercase, lowercase, number and symbol. 8-20 characters."
    )
    .required("Password is required"),
  passwordRepeat: Yup.string()
    .required("Required")
    .test("password-match", "Password must match", function (value) {
      return this.parent.password === value;
    }),
});

interface UserData {
  name: string;
  email: string;
  password: string;
}

interface Props {
  role: UserRole;
}

const SignUpForm: FC<Props> = ({ role }) => {
  const router = useRouter();
  const handleFormSubmit = async (formData: UserData) => {
    const data = { ...formData, role };
    try {
      const res = await axios.post("/api/auth/createUser", data);
      console.log("response", res);
      router.push("/signin");
    } catch (e) {
      console.log("An error has occured creating the user");
    }
  };

  const initialValues: FormData = {
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(formData) => handleFormSubmit(formData)}
    >
      <Form className="p-4">
        <FormikInput
          name="name"
          type="input"
          label={role === UserRole.HOST ? "School Name" : "Name"}
          Icon={HiOutlineLibrary}
          placeholder={
            role === UserRole.HOST
              ? "e.g. Blue Finch School"
              : "e.g. John Smith"
          }
        />
        <FormikInput
          name="email"
          type="input"
          label="Email address"
          placeholder="example@email.com"
          Icon={HiAtSymbol}
        />
        <PasswordField name="password" label="Password" />
        <PasswordField name="passwordRepeat" label="Confirm Password" />
        <div className="flex justify-end">
          <FormNavigationButton type="submit" className="mt-2">
            Create
          </FormNavigationButton>
        </div>
      </Form>
    </Formik>
  );
};

export default SignUpForm;
