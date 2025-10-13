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
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import Link from "next/link"
// import Logo from "../Logo"
// import { CostumInput } from "../ui/custom-input"
// import { PasswordInput, PasswordInputAdornmentToggle, PasswordInputInput } from "../ui/password-input"
// import { toast } from "sonner"
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
// import React, { useState } from "react"
// import { useRouter } from "next/navigation"
// import { signUpAction } from "@/app/action/signUp-action"

// const formSchema = z.object({
//   name: z.string().min(2, {
//     message: "Name must be at least 2 characters.",
//   }),
//   email: z.string().email({
//     message: "Invalid email address.",
//   }),
//   password: z.string().min(8, {
//     message: "Password must be at least 8 characters.",
//   }),
// })

// export function SignUpForm({
//   className,
//   ...props
// }: React.ComponentProps<"div">) {

//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
//   const router = useRouter()

//   // URL'den email, name ve session_id parametrelerini al (success page'den gelebilir)
//   const [prefilledEmail, setPrefilledEmail] = useState<string>('')
//   const [prefilledName, setPrefilledName] = useState<string>('')
//   const [sessionId, setSessionId] = useState<string>('')

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//     },
//   })

//   React.useEffect(() => {
//     const params = new URLSearchParams(window.location.search)
//     const emailParam = params.get('email')
//     const nameParam = params.get('name')
//     const sessionParam = params.get('session_id')

//     if (emailParam) {
//       setPrefilledEmail(emailParam)
//       form.setValue('email', emailParam)
//     }

//     if (nameParam) {
//       setPrefilledName(nameParam)
//       form.setValue('name', nameParam)
//     }

//     if (sessionParam) {
//       setSessionId(sessionParam)
//     }
//   }, [form])
// async function handleSignUp(data: z.infer<typeof formSchema>) {
//   setIsSubmitting(true);

//   const formData = new FormData();
//   formData.append("email", data.email);
//   formData.append("password", data.password);
//   formData.append("name", data.name);

//   // Eğer session_id varsa ekle (order eşleştirmesi için)
//   if (sessionId) {
//     formData.append("session_id", sessionId);
//   }

//   try {
//     const result = await signUpAction(formData);

//     if (result?.error) {
//       toast.error(result.error);
//     } else if (result?.success && result?.emailSent) {
//       toast.success(result.message || "Kayıt başarılı! Email'inizi doğrulayın.");
//       // Verify email page'e yönlendir - email doğrulaması için
//       window.location.href = `/auth/verify-email?email=${encodeURIComponent(data.email)}`;
//     } else {
//       // Beklenmeyen durum
//       toast.error("Bir hata oluştu, lütfen tekrar deneyin.");
//     }
//   } catch (error) {
//     toast.error("An unexpected error occurred");
//   } finally {
//     setIsSubmitting(false);
//   }
// }

// function onSubmit(values: z.infer<typeof formSchema>) {
//   handleSignUp(values)
// }

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card className="bg-[#171717]">
//         <Logo width={40} height={50} className="self-center" />
//         <CardHeader>
//           <CardTitle>Sign up to your account</CardTitle>
//           <CardDescription>
//             Enter your email below to login to your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">Name</FormLabel>
//                     <FormControl>
//                       <CostumInput placeholder="Enter your full name" {...field} />
//                     </FormControl>
//                     {prefilledName && (
//                       <p className="text-xs text-green-400">
//                         ✅ Form'dan otomatik dolduruldu. İsterseniz değiştirebilirsiniz.
//                       </p>
//                     )}
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">Email</FormLabel>
//                     <FormControl>
//                       <CostumInput
//                         placeholder="Enter your email"
//                         {...field}
//                       />
//                     </FormControl>
//                     {prefilledEmail && (
//                       <p className="text-xs text-blue-400">
//                         💡 Stripe'da kullandığınız email (öncelikli). İsterseniz değiştirebilirsiniz, order'larınız otomatik eşleşecek.
//                       </p>
//                     )}
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
//                         href="/auth/signIn"
//                         className="text-sm text-white underline-offset-4 hover:underline"
//                       >
//                         Already have an account?
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
//                   {isSubmitting ? "Signing up..." : "Sign up"}
//                 </Button>
//                 <Button variant="outline" className="w-full bg-white text-black hover:bg-white/90 hover:text-black" type="button">
//                   Sign up with Google
//                 </Button>
//               </div>
//             </form>
//           </Form>

//           <div className="mt-4 text-center text-white text-sm">
//             Already have an account?{" "}
//             <Link href="/auth/signIn" className="underline underline-offset-4 text-white">
//               Sign in
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
