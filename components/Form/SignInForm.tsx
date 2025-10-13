// "use client"

// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card-custom"
// import { Label } from "@/components/ui/label"
// import Link from "next/link"
// import { CostumInput } from "../ui/custom-input"
// import Logo from "../Logo"
// import { PasswordInput, PasswordInputAdornmentToggle, PasswordInputInput } from "../ui/password-input"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"
// import { Loader } from "lucide-react"
// import { signInAction } from "@/app/action/signIn-action"

// const formSchema = z.object({

//   password: z.string().min(8, {
//     message: "Password must be at least 8 characters.",
//   }),
//   email: z.string().email({
//     message: "Invalid email address.",
//   }),
// })

// export function SignInForm({
//   className,
//   ...props
// }: React.ComponentProps<"div">) {

//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
//   const router = useRouter()
//   async function handleSignIn(data: z.infer<typeof formSchema>) {
//     setIsSubmitting(true);

//     const formData = new FormData();
//     formData.append("email", data.email);
//     formData.append("password", data.password);

//     try {
//       const result = await signInAction(formData);

//       if (result?.error) {
//         toast.error(result.error);
//       } else {
//         toast.success("Signed in successfully");
//         window.location.href = "/dashboard";
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred");
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   })

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     handleSignIn(values)
//   }

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card className="bg-[#171717]">
//         <Logo  width={40} height={50} className="self-center" />
//         <CardHeader>
//           <CardTitle>Sign in to your account</CardTitle>
//           <CardDescription>
//             Enter your email below to login to your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">Email</FormLabel>
//                     <FormControl>
//                       <CostumInput placeholder="Enter your email" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <div className="flex items-center justify-between">
//                       <FormLabel className="text-white">Password</FormLabel>
//                       <Link
//                         href="/auth/forgot-password"
//                         className="text-sm text-white underline-offset-4 hover:underline"
//                       >
//                         Forgot your password?
//                       </Link>
//                     </div>
//                     <FormControl>
//                       <PasswordInput>
//                         <PasswordInputInput
//                           placeholder="Enter your password"
//                           {...field}
//                           className="w-full text-white"
//                         />
//                         <PasswordInputAdornmentToggle />
//                       </PasswordInput>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex flex-col gap-3">
//                 <Button type="submit" className="w-full" disabled={isSubmitting}>
//                   {isSubmitting ? "Signing in..." : "Sign in"}
//                   {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
//                 </Button>
//                 <Button variant="outline" className="w-full bg-white text-black hover:bg-white/90 hover:text-black" type="button">
//                   Sign in with Google
//                 </Button>
//               </div>
//             </form>
//           </Form>
//             <div className="mt-4 text-center text-sm text-white">
//               Don&apos;t have an account?{" "}
//               <Link href="/auth/signUp" className="text-white underline underline-offset-4">
//                 Sign up
//               </Link>

//             </div>

//         </CardContent>
//       </Card>
//     </div>
//   )
// }
