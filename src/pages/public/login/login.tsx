import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { z } from "zod";
import Ic_logo from "../../../assets/images/Ic_logo.svg";
import Button from "../../../components/common/button";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ApiUtils from "../../../api/ApiUtils";
import { setCredentials } from "../../../store/slice/auth.slice";
import { setUserDetails } from "../../../store/slice/user.slice";

export const Login = () => {
  const formSchema = z.object({
    email: z
      .string()
      .email({ message: "Please enter a valid email address." })
      .min(1, { message: "Email address is required." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[@$!%*?&]/, {
        message: "Password must contain at least one special character.",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // console.log(data);
    try {
      const response: any = await ApiUtils.authLogin(data);
      if (response.data.accessToken) {
        const { accessToken, refreshToken, user } = response.data;
        dispatch(
          setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
            user,
          })
        );
        localStorage.setItem("job_seeker_email", response.data.user.email);

        navigate("/dashboard");

        const userDetails = await ApiUtils.getSingleUser(user.id);

        dispatch(setUserDetails(userDetails?.data));
        toast.success("Login successfully", { position: "top-right" });
      } else {
        toast.error(response.data.message || "Check Email or Password", {
          position: "top-right",
        });

        console.error("API error:", response.error);
      }
    } catch (error: any) {
      toast.error(error.data.message, {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="relative w-full max-w-[490px]">
          <div className="mx-4 bg-white p-7 w-full shadow-shadow1">
            <div className="flex justify-center mb-10">
              <img src={Ic_logo} alt="logo" />
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm font-medium`}
                          >
                            E-mail
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter E-mail"
                                {...field}
                                className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray"
                                          } `}
                                type="text"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm font-medium`}
                          >
                            Password
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter Password"
                                {...field}
                                className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray"
                                          } `}
                                type="password"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-end w-full gap-5 items-center pt-8">
                  <div onClick={() => form.reset()} className="w-1/2 sm:w-auto">
                    <Button
                      text="Cancel"
                      className="border-2 border-purple text-purple text-sm rounded-[8px] h-[40px] font-medium relative px-6 py-[10px] flex items-center gap-2"
                    />
                  </div>
                  <Button
                    text="Submit"
                    className="border-2 border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-6 py-[10px] flex items-center gap-2"
                    type="submit"
                  />
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};
