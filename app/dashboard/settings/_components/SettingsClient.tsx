"use client";

import React, { useActionState, useState, useEffect, useMemo } from "react";
import {
  updateUserProfile,
  changePassword,
  DeleteUser,
  updateUserImage,
} from "@/app/action/user-action";
import { toast } from "sonner";
import { Loader, Plus, X, Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@uploadthing/react";
import Image from "next/image";
function SubmitButton({
  text = "Save",
  isPending,
}: {
  text?: string;
  isPending?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="px-4 py-2 rounded-lg bg-[#171719] text-white hover:bg-[#171719] border border-white/10"
    >
      {isPending ? "Saving..." : text}
    </button>
  );
}

export default function Page({ user: initialUser }: { user: any }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(initialUser);
  const [loading, setLoading] = useState(false);
  const [socialMediaLinks, setSocialMediaLinks] = useState<string[]>(() => {
    // Initialize from server data
    console.log("Initial user socialMedia:", initialUser?.socialMedia);
    if (initialUser?.socialMedia && initialUser.socialMedia !== "") {
      try {
        const links = JSON.parse(initialUser.socialMedia);
        console.log("Parsed social media links:", links);
        return Array.isArray(links) ? links : [initialUser.socialMedia];
      } catch {
        console.log(
          "Failed to parse, using as string:",
          initialUser.socialMedia
        );
        return [initialUser.socialMedia];
      }
    }
    console.log(
      "No social media data (null or empty), starting with empty array"
    );
    return [];
  });
  const [newSocialMediaLink, setNewSocialMediaLink] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  // 🧠 useActionState setup
  const [imageState, imageFormAction, isPendingImage] = useActionState(
    async (prevState: any, url: string) => {
      const result = await updateUserImage(url);
      return result;
    },
    { success: false, error: undefined, message: "" }
  );

  // 📤 uploadthing upload handler
  const handleUpload = async (files: { url?: string; ufsUrl?: string }[]) => {
    const url = files[0]?.ufsUrl || files[0]?.url;
    if (!url) {
      toast.error("Upload failed — no URL returned.");
      return;
    }

    // 🔹 useActionState trigger
    toast.loading("Saving image...");
    await imageFormAction(url); // ✅ server action tetikleniyor
    toast.dismiss();
  };

  // 🔁 imageState değişince UI bildir
  React.useEffect(() => {
    if (imageState.success) {
      toast.success(imageState.message || "Profile image updated!");
      // Update local state instead of full page refresh
      setUser((prev: any) => ({ ...prev, image: imageState.image }));
    } else if (imageState.error) {
      toast.error(imageState.error);
    }
  }, [imageState]);

  const [state, formAction, isPending] = useActionState(updateUserProfile, {
    error: undefined,
    success: false,
    user: initialUser,
    message: "",
  });
  const [passwordState, passwordFormAction, isPendingPassword] = useActionState(
    changePassword,
    { error: undefined, success: false, message: "" }
  );
  const [deleteState, deleteFormAction, isPendingDelete] = useActionState(
    DeleteUser,
    { error: undefined, success: false, message: "" }
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Profile updated successfully");
      // Update local user state with new data if available
      if (state.user) {
        setUser(state.user);
        // Update social media links from new user data only if it exists
        if (state.user.socialMedia) {
          try {
            const links = JSON.parse(state.user.socialMedia);
            setSocialMediaLinks(
              Array.isArray(links) ? links : [state.user.socialMedia]
            );
          } catch {
            setSocialMediaLinks([state.user.socialMedia]);
          }
        }
        // Don't clear socialMediaLinks if server data is empty - keep local state
      }
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  useEffect(() => {
    if (passwordState?.success) {
      toast.success(passwordState.message || "Password changed successfully");
      const form = document.getElementById(
        "change-password-form"
      ) as HTMLFormElement;
      form?.reset();
      setIsPasswordDialogOpen(false);
    } else if (passwordState?.error) {
      toast.error(passwordState.error);
    }
  }, [passwordState]);

  const addSocialMediaLink = () => {
    if (newSocialMediaLink && !socialMediaLinks.includes(newSocialMediaLink)) {
      const updatedLinks = [...socialMediaLinks, newSocialMediaLink];
      console.log("Adding social media link:", newSocialMediaLink);
      console.log("Updated links:", updatedLinks);
      setSocialMediaLinks(updatedLinks);
      setNewSocialMediaLink("");
    }
  };

  const removeSocialMediaLink = (index: number) => {
    setSocialMediaLinks(socialMediaLinks.filter((_, i) => i !== index));
  };

  function handleDeleteUser() {
    setIsDeleteDialogOpen(true);
  }

  function handleDeleteUserConfirm() {
    setIsDeleteDialogOpen(false);
  }

  // e-posta'nın ilk harfini al - memoized for performance
  const initial = useMemo(() => {
    return (user?.email || initialUser?.email)?.charAt(0)?.toUpperCase() || "?";
  }, [user?.email, initialUser?.email]);
  //   if (loading) return <div className="flex flex-1 flex-col items-center justify-center dark:bg-[#171719]"><Loader className="w-8 h-8 animate-spin text-gray-500" /></div>;

  return (
    <>
      <div className="flex flex-1 flex-col dark:bg-[#171719]">
        <div className="flex h-full w-full flex-row gap-x-2 p-5">
          <div className="dark:md:bg-[#171719] dark:border-[#313131] dark:border-solid shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.25)] md:shadow-xs relative flex w-full flex-col items-center rounded-2xl px-4 md:overflow-y-auto md:border md:bg-white md:px-8">
            <div className="flex h-full w-full flex-col max-w-(--breakpoint-sm)! max-w-(--breakpoint-xl)">
              {/* Header */}
              <div className="flex w-full flex-col gap-y-4 py-8 md:flex-row md:items-center md:justify-between md:py-8">
                <h4 className="whitespace-nowrap text-2xl font-medium dark:text-white">
                  Settings
                </h4>
              </div>

              <div className="flex w-full flex-col pb-8" style={{ opacity: 1 }}>
                <div className="flex flex-col gap-y-12">
                  {/* === ORGANIZATION PROFILE === */}
                  <div className="relative flex flex-col gap-4">
                    {/* Profile Header */}
                    <div className="flex w-full flex-col gap-1">
                      <h2 className="text-lg font-medium">Profile</h2>
                    </div>

                    {/* Profile Form */}
                    <form
                      action={formAction}
                      className="max-w-2xl"
                      onSubmit={(e) => {
                        console.log(
                          "Form submitting with social links:",
                          socialMediaLinks
                        );
                      }}
                    >
                      <div className="dark:ring-0 dark:bg-[#171719] dark:border-[#313131] dark:border-solid shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.25)] w-full flex-col overflow-hidden border rounded-2xl bg-transparent ring-1 ring-gray-200 dark:ring-0">
                        {/* User ID */}
                        <div className="flex gap-x-12 gap-y-4 p-4 flex-col md:flex-row md:items-start md:justify-between">
                          <div className="md:max-w-1/2 flex w-full flex-col">
                            <h3 className="text-sm font-medium">User ID</h3>
                            <p className="dark:text-polar-500 text-xs text-gray-500">
                              Unique identifier for your account
                            </p>
                          </div>
                          <div className="flex w-full flex-row gap-y-2 md:w-full md:justify-end">
                            <div className="dark:border-solid shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.25)] dark:bg-[#171717] dark:divide-polar-700 shadow-xs flex w-full flex-row items-center overflow-hidden rounded-xl border bg-white">
                              <div className="relative flex flex-1 flex-row rounded-full">
                                <input
                                  className="h-10 w-full grow border-none bg-transparent px-3 py-2 text-base text-gray-600 outline-none dark:bg-transparent dark:text-polar-400"
                                  readOnly
                                  value={initialUser?.id || ""}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    initialUser?.id || ""
                                  );
                                  toast.success("User ID copied to clipboard");
                                }}
                                className="h-8 rounded-lg px-3 py-1.5 mr-1 text-xs bg-transparent  dark:hover:bg-[#171717] text-black dark:text-white"
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Member Since */}
                        <div className="flex gap-x-12 gap-y-4 p-4 flex-col md:flex-row md:items-start md:justify-between">
                          <div className="md:max-w-1/2 flex w-full flex-col">
                            <h3 className="text-sm font-medium">
                              Member Since
                            </h3>
                            <p className="dark:text-polar-500 text-xs text-gray-500">
                              Account creation date
                            </p>
                          </div>
                          <div className="flex w-full flex-row gap-y-2 md:w-full md:justify-end">
                            <div className="dark:border-[#313131] dark:bg-[#171719] shadow-xs flex w-full flex-row items-center overflow-hidden rounded-xl border bg-white">
                              <div className="relative flex flex-1 flex-row rounded-full">
                                <input
                                  className="h-10 w-full grow dark:bg-[#171719] border-none dark:border-[#313131] bg-transparent px-3 py-2 text-base text-gray-600 outline-none  dark:text-white"
                                  readOnly
                                  value={
                                    initialUser?.createdAt
                                      ? new Date(
                                          initialUser.createdAt
                                        ).toLocaleDateString()
                                      : ""
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Avatar, Name, Email */}
                        <div className="flex flex-col gap-y-4 p-4">
                          <div className="space-y-8">
                            <div className="space-y-6 grid grid-cols-1 gap-6 sm:grid-cols-12">
                              {/* Avatar */}
                              <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-medium">
                                  Avatar
                                </label>
                                <div className="relative inline-block">
                                  {/* Avatar görüntüsü */}
                                  <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-300 dark:border-[#313131] group cursor-pointer bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                                    {user?.image || initialUser?.image ? (
                                      <Image
                                        src={
                                          user?.image ||
                                          initialUser?.image ||
                                          ""
                                        }
                                        alt="User avatar"
                                        fill
                                        className="object-cover transition-opacity duration-300 group-hover:opacity-70"
                                      />
                                    ) : (
                                      <span className="text-3xl font-semibold text-gray-700 dark:text-gray-200 select-none">
                                        {initial}
                                      </span>
                                    )}

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                      {isPendingImage ? (
                                        <Loader2 className="animate-spin w-5 h-5" />
                                      ) : (
                                        <span className="text-xs font-medium">
                                          Change
                                        </span>
                                      )}
                                    </div>

                                    {/* UploadDropzone’ı görünmez yapıyoruz */}
                                    <div className="absolute inset-0 opacity-0">
                                      <UploadDropzone
                                        endpoint="imageUploader"
                                        onClientUploadComplete={handleUpload}
                                        appearance={{
                                          container:
                                            "w-full h-full cursor-pointer",
                                          button: "hidden",
                                        }}
                                        className="w-full h-full"
                                      />
                                    </div>
                                  </div>

                                  {isPendingImage && (
                                    <p className="text-sm text-gray-500 mt-2 text-center">
                                      Uploading...
                                    </p>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Click to update
                                </p>
                              </div>

                              {/* Name & Email */}
                              <div className="space-y-4 sm:col-span-10">
                                <div>
                                  <label className="mb-2 block text-sm font-medium">
                                    Name *
                                  </label>
                                  <Input
                                    name="name"
                                    className="h-10 w-full border-gray-200 focus:outline-none shadow-none focus:ring-0 grow dark:bg-[#171719]  dark:border-[#313131] bg-transparent px-3 py-2 text-base text-gray-600   dark:text-white"
                                    defaultValue={initialUser?.name || ""}
                                  />
                                </div>
                                <div>
                                  <label className="mb-2 block text-sm font-medium">
                                    Email *
                                  </label>
                                  <Input
                                    name="email"
                                    type="email"
                                    className="h-10 w-full border-gray-200 focus:outline-none shadow-none focus:ring-0 grow dark:bg-[#171719]  dark:border-[#313131] bg-transparent px-3 py-2 text-base text-gray-600   dark:text-white"
                                    defaultValue={initialUser?.email || ""}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Website */}
                            <div>
                              <label className="mb-2 block text-sm font-medium">
                                Website
                              </label>
                              <Input
                                name="website"
                                type="url"
                                className="h-10 w-full border-gray-200 focus:outline-none shadow-none focus:ring-0 grow dark:bg-[#171719]  dark:border-[#313131] bg-transparent px-3 py-2 text-base text-gray-600   dark:text-white"
                                placeholder="https://example.com"
                                defaultValue={initialUser?.website || ""}
                              />
                            </div>

                            {/* Social Media */}
                            <div>
                              <label className="mb-2 block text-sm font-medium">
                                Social Media Links
                              </label>
                              <div className="space-y-3">
                                {/* Add new link */}
                                <div className="flex gap-2">
                                  <Input
                                    value={newSocialMediaLink}
                                    onChange={(e) =>
                                      setNewSocialMediaLink(e.target.value)
                                    }
                                    type="url"
                                    className="h-10 w-full border-gray-200   rounded-lg focus:outline-none shadow-none focus:ring-0 grow dark:bg-[#171719] dark:border-[#313131] bg-transparent px-3 py-2 text-base text-gray-600 dark:text-white"
                                    placeholder="https://instagram.com/yourprofile"
                                  />
                                  <Button
                                    type="button"
                                    onClick={addSocialMediaLink}
                                    className="h-10 w-10 p-0 rounded-lg"
                                    disabled={!newSocialMediaLink}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>

                                {/* Debug: Show current social media links */}
                                {/* <div className="text-xs text-gray-500">
                                  Debug: {JSON.stringify(socialMediaLinks)}
                                </div> */}

                                {/* Display existing links */}
                                {socialMediaLinks.length > 0 && (
                                  <div className="space-y-2">
                                    {socialMediaLinks.map((link, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-[#313131] rounded-lg"
                                      >
                                        <span className="flex-1 text-sm break-all">
                                          {link}
                                        </span>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            removeSocialMediaLink(index)
                                          }
                                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Hidden input for form submission */}
                                <input
                                  type="hidden"
                                  name="socialMedia"
                                  value={JSON.stringify(socialMediaLinks)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                          <SubmitButton isPending={isPending} />
                          {/* 
                   
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsPasswordDialogOpen(true)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#171719]"
                          >
                            Change Password
                          </Button> */}
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* <div className="relative flex flex-col gap-4" id="subscriptions"> */}
                  {/* <div className="flex w-full flex-col gap-1">
        <h2 className="text-lg font-medium">Subscriptions</h2>
      </div>
      <form>
        <div className="w-full flex-col divide-y divide-gray-200 overflow-hidden border border-[#313131] rounded-2xl bg-[#171719] ring-0 ring-gray-200 dark:divide-[#313131]  dark:bg-[#171719] dark:border-[#313131] dark:ring-0">
 
          <div className="flex gap-x-12 gap-y-4 p-4 flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex w-full flex-col md:max-w-[50%]">
              <h3 className="text-sm font-medium">Allow multiple subscriptions</h3>
              <p className="text-xs text-gray-500 dark:text-polar-500">
                Customers can have multiple active subscriptions at the same time.
              </p>
            </div>
            <div className="flex w-full flex-row gap-y-2 md:w-full md:justify-end">
              <div className="space-y-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked="false"
                  data-state="unchecked"
                  value="on"
                  className="peer inline-flex h-[18px] w-[37px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-polar-700 data-[state=checked]:bg-blue-500"
                  id="_r_21j_-form-item"
                  aria-describedby="_r_21j_-form-item-description"
                  aria-invalid="false"
                >
                  <span
                    data-state="unchecked"
                    className="pointer-events-none block h-2 w-2 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-1 bg-white dark:data-[state=unchecked]:bg-polar-500 dark:data-[state=checked]:bg-white"
                  ></span>
                </button>
                <input
                  aria-hidden="true"
                  tabIndex="-1"
                  type="checkbox"
                  value="on"
                  style={{
                    transform: 'translateX(-100%)',
                    position: 'absolute',
                    pointerEvents: 'none',
                    opacity: 0,
                    margin: 0,
                    width: '37px',
                    height: '18px',
                  }}
                />
              </div>
            </div>
          </div>

       
          <div className="flex gap-x-12 gap-y-4 p-4 flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex w-full flex-col md:max-w-[50%]">
              <h3 className="text-sm font-medium">Allow price changes</h3>
              <p className="text-xs text-gray-500 dark:text-polar-500">
                Customers can switch their subscription's price from the customer portal
              </p>
            </div>
            <div className="flex w-full flex-row gap-y-2 md:w-full md:justify-end">
              <div className="space-y-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked="true"
                  data-state="checked"
                  value="on"
                  className="peer inline-flex h-[18px] w-[37px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-polar-700 data-[state=checked]:bg-blue-500"
                  id="_r_21k_-form-item"
                  aria-describedby="_r_21k_-form-item-description"
                  aria-invalid="false"
                >
                  <span
                    data-state="checked"
                    className="pointer-events-none block h-2 w-2 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-1 bg-white dark:data-[state=unchecked]:bg-polar-500 dark:data-[state=checked]:bg-white"
                  ></span>
                </button>
                <input
                  aria-hidden="true"
                  tabIndex={-1}
                  type="checkbox"
                  value="on"
                  defaultChecked
                  style={{
                    transform: 'translateX(-100%)',
                    position: 'absolute',
                    pointerEvents: 'none',
                    opacity: 0,
                    margin: 0,
                    width: '37px',
                    height: '18px',
                  }}
                />
              </div>
            </div>
          </div>

        
          <div className="flex gap-x-12 gap-y-4 p-4 flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex w-full flex-col md:max-w-[50%]">
              <h3 className="text-sm font-medium">Proration</h3>
              <p className="text-xs text-gray-500 dark:text-polar-500">
                Determines how to bill customers when they change their subscription
              </p>
            </div>
            <div className="flex w-full flex-row gap-y-2 md:w-full md:justify-end">
              <div className="space-y-2">
                <button
                  type="button"
                  role="combobox"
                  aria-controls="radix-_r_21m_"
                  aria-expanded="false"
                  aria-autocomplete="none"
                  dir="ltr"
                  data-state="closed"
                  className="flex flex-row gap-x-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-xs transition-colors hover:bg-gray-50 dark:bg-polar-800 dark:hover:bg-polar-700 dark:border-polar-700 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                >
                  Next Invoice
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-down h-4 w-4 opacity-50"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </button>
                <select
                  aria-hidden="true"
                  tabIndex={-1}
                  style={{
                    position: 'absolute',
                    border: '0px',
                    width: '1px',
                    height: '1px',
                    padding: '0px',
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0px, 0px, 0px, 0px)',
                    whiteSpace: 'nowrap',
                    overflowWrap: 'normal',
                  }}
                >
                  <option value="invoice">Invoice Immediately</option>
                  <option value="prorate" >
                    Next Invoice
                  </option>
                </select>
              </div>
            </div>
          </div>

         
          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
            <button
              className="relative inline-flex h-8 items-center cursor-pointer font-medium select-none justify-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap bg-blue-500 text-white hover:opacity-85 transition-opacity duration-100 border border-white/10 rounded-lg px-3 py-1.5 text-xs self-start"
              disabled
              type="submit"
            >
              <div className="flex flex-row items-center">Save</div>
            </button>
          </div>
        </div>
      </form> */}
                  {/* </div> */}

                  {/* <div className="relative flex flex-col gap-4" id="notifications">
      <div className="flex w-full flex-col gap-1">
        <h2 className="text-lg font-medium">Notifications</h2>
      </div>
      <form>
        <div className="w-full flex-col divide-y divide-gray-200 overflow-hidden rounded-2xl border border-[#313131] ring-0 ring-gray-200 dark:divide-[#313131] dark:bg-[#171719] dark:border-[#313131] dark:ring-0">
      
          <div className="flex gap-x-12 gap-y-4 p-4 flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex w-full flex-col md:max-w-[50%]">
              <h3 className="text-sm font-medium">New Orders</h3>
              <p className="text-xs text-gray-500 dark:text-polar-500">
                Send a notification when new orders are created
              </p>
            </div>
            <div className="flex w-full flex-row gap-y-2 md:w-full md:justify-end">
              <div className="space-y-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked="true"
                  data-state="checked"
                  value="on"
                  className="peer inline-flex h-[18px] w-[37px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-polar-700 data-[state=checked]:bg-blue-500"
                  id="_r_21n_-form-item"
                  aria-describedby="_r_21n_-form-item-description"
                  aria-invalid="false"
                >
                  <span
                    data-state="checked"
                    className="pointer-events-none block h-2 w-2 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-1 bg-white dark:data-[state=unchecked]:bg-polar-500 dark:data-[state=checked]:bg-white"
                  ></span>
                </button>
                <input
                  aria-hidden="true"
                  tabIndex={-1}
                  type="checkbox"
                  value="on"
                  defaultChecked
                  style={{
                    transform: 'translateX(-100%)',
                    position: 'absolute',
                    pointerEvents: 'none',
                    opacity: 0,
                    margin: 0,
                    width: '37px',
                    height: '18px',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
            <button
              className="relative inline-flex h-8 items-center cursor-pointer font-medium select-none justify-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap bg-blue-500 text-white hover:opacity-85 transition-opacity duration-100 border border-white/10 rounded-lg px-3 py-1.5 text-xs self-start"
              disabled
              type="submit"
            >
              <div className="flex flex-row items-center">Save</div>
            </button>
          </div>
        </div>
      </form>
    </div> */}

                  <div className="relative flex flex-col gap-4" id="developers">
                    <div className="flex w-full flex-col gap-1">
                      <h2 className="text-lg font-medium">Delete Account</h2>
                      <p className="text-gray-500 dark:text-polar-500">
                        Delete your account and all your data
                      </p>
                    </div>
                    <div className="flex w-full flex-col">
                      <div className="w-full overflow-hidden rounded-2xl border border-[#313131] ring-1 ring-gray-200 dark:bg-[#171719] dark:border-[#313131] dark:ring-0">
                        {/* Token Item */}
                        <form action={handleDeleteUser} className="max-w-2xl">
                          <div className="border-t border-[#313131] p-5 first:border-t-0 dark:border-[#313131]">
                            <div className="flex flex-col gap-y-4">
                              <div className="flex flex-row items-center justify-between">
                                <div className="flex flex-row">
                                  <div className="flex flex-col gap-y-1">
                                    <h3 className="text-md">Your Account</h3>
                                    <p className="text-sm text-gray-500 dark:text-polar-400">
                                      Expires on October 29, 2025 — Last used on
                                      September 29, 2025
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-row items-center gap-2 text-gray-500 dark:text-polar-400">
                                  <Dialog
                                    open={isDeleteDialogOpen}
                                    onOpenChange={setIsDeleteDialogOpen}
                                  >
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          Delete Account
                                        </DialogTitle>
                                        <DialogDescription>
                                          Are you sure you want to delete your
                                          account?
                                        </DialogDescription>
                                      </DialogHeader>
                                    </DialogContent>
                                    <DialogFooter>
                                      <button
                                        onClick={() =>
                                          handleDeleteUserConfirm()
                                        }
                                        disabled={isPendingDelete}
                                        className="relative inline-flex h-8 items-center cursor-pointer font-medium select-none justify-center ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap bg-red-500 text-white hover:bg-red-400 dark:bg-red-600 dark:hover:bg-red-500 rounded-lg px-3 py-1.5 text-xs"
                                        type="button"
                                      >
                                        <div className="flex flex-row items-center">
                                          {isPendingDelete ? (
                                            <Loader className="w-4 h-4 animate-spin" />
                                          ) : (
                                            <div className="flex flex-row items-center">
                                              Delete
                                            </div>
                                          )}
                                        </div>
                                      </button>
                                    </DialogFooter>
                                  </Dialog>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your password to keep your account secure
            </DialogDescription>
          </DialogHeader>

          <form
            id="change-password-form"
            action={passwordFormAction}
            className="space-y-4"
          >
            {/* Current Password */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Current Password *
              </label>
              <Input
                name="currentPassword"
                type="password"
                className="h-10 w-full"
                placeholder="Enter your current password"
                required
              />
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                New Password *
              </label>
              <Input
                name="newPassword"
                type="password"
                className="h-10 w-full"
                placeholder="Enter new password (min 6 characters)"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Confirm New Password *
              </label>
              <Input
                name="confirmPassword"
                type="password"
                className="h-10 w-full"
                placeholder="Confirm your new password"
                required
              />
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(false)}
              >
                Cancel
              </Button>
              <SubmitButton
                text="Change Password"
                isPending={isPendingPassword}
              />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
