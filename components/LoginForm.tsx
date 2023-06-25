import { FC } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "./FormikInput";
import FormNavigationButton from "./SubmitButton";
import PasswordField from "./FormikPasswordField";
import { HiAtSymbol } from "react-icons/hi";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
  passwordRepeat: string;
}

const validationSchema: Yup.ObjectSchema<FormData> = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: Yup.string().required("Password is required"),
  passwordRepeat: Yup.string()
    .required("Required")
    .test("password-match", "Password must match", function (value) {
      return this.parent.password === value;
    }),
});

interface Credentials {
  email: string;
  password: string;
}

const LoginForm: FC = () => {
  const router = useRouter();
  const handleFormSubmit = async ({ email, password }: Credentials) => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log(res);
    router.push("/dashboard");
  };

  const initialValues: FormData = {
    email: "",
    password: "",
    passwordRepeat: "",
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={({ email, password }) => {
        handleFormSubmit({ email, password });
      }}
    >
      <Form className="p-4">
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
            Login
          </FormNavigationButton>
        </div>
      </Form>
    </Formik>
  );
};

export default LoginForm;
