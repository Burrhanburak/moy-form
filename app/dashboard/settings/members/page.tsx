"use client";

import React, { useState } from "react";
import { IconPlus } from "@tabler/icons-react";

interface Member {
  email: string;
  joinedOn: string;
  avatar?: string;
}

interface MembersProps {
  members: Member[];
}

export default function MembersPage( { members }: MembersProps ) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = () => {
    console.log("Inviting:", inviteEmail);
    setInviteEmail("");
    setIsDialogOpen(false);
  };

  return (
    <div className="relative flex h-full w-full flex-col gap-y-4">
      <main className="relative flex min-h-0 w-full grow flex-col">
        <div className="flex h-full w-full flex-row gap-x-2 p-5">
          <div className="dark:md:bg-[#171719]  md:shadow-xs relative flex w-full flex-col items-center rounded-2xl border-gray-200 dark:border-[#313131] px-4 md:overflow-y-auto md:border md:bg-white md:px-8">
            <div className="flex h-full w-full flex-col max-w-[--breakpoint-sm]! max-w-[--breakpoint-xl]">
              <div className="flex w-full flex-col gap-y-4 py-8 md:flex-row md:items-center md:justify-between md:py-8">
                <h4 className="whitespace-nowrap text-2xl font-medium dark:text-white">
                  Members
                </h4>
                <button
                  type="button"
                  className="gap-2 [&_svg]:pointer-events-none [&_svg]:size-4! [&_svg]:shrink-0 boder-[#313131]  relative inline-flex items-center font-medium select-none justify-center ring-offset-background focus-visible:outline-none  disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap bg-white text-black border border-gray-200 dark:border-[#313131] dark:bg-[#171719] dark:text-white hover:opacity-85 transition-opacity duration-100 h-10 px-4 py-2 rounded-xl text-sm"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <div className="flex flex-row items-center">
                    <IconPlus className="mr-2" />
                    <span>Invite</span>
                  </div>
                </button>
              </div>

              <div className="w-full pb-8 flex flex-col gap-y-8" style={{ opacity: 1 }}>
                <p className="dark:text-[#999999] text-gray-500">
                  Manage users who have access to this organization. All members are entitled to view and manage organization settings, products, subscriptions, etc.
                </p>

                <div className="flex flex-col gap-6">
                  <div className="dark:border-[#313131] overflow-hidden rounded-2xl border  border-gray-200">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm table-fixed">
                        <thead className="[&_tr]:border-b">
                        <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors dark:bg-[#171719] bg-gray-50">
                            <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0" style={{ width: 150 }}>
                             
                              User
                            </th>
                            <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0" style={{ width: 150 }}>
                              Joined on
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {/* {members.map((member) => (
                            <tr key={member.email} className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                              <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0" style={{ width: 150 }}>
                                <div className="flex flex-row items-center gap-2">
                                  <div className="dark:bg-polar-900 dark:border-polar-700 z-2 relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-50 text-sm">
                                    <img
                                      alt={member.email}
                                      loading="eager"
                                      className="z-1 aspect-square rounded-full object-cover opacity-100"
                                      src={member.avatar || "https://via.placeholder.com/24"}
                                    />
                                  </div>
                                  <div className="fw-medium">{member.email}</div>
                                </div>
                              </td>
                              <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0" style={{ width: 150 }}>
                                {member.joinedOn}
                              </td>
                            </tr>
                          ))} */}
                          <tr>
                            <td className="p-4">
                                <div className="flex flex-row items-center gap-2">
                                    <div className="dark:bg-[#171719] dark:border-[#313131] z-2 relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-gray-50 bg-gray-50 text-sm">
                                        <img
                                          alt="test@test.com"
                                          loading="eager"
                                          className="z-1 aspect-square rounded-full object-cover opacity-100"
                                          src="https://via.placeholder.com/24"
                                        />
                                    </div>
                                    <div className="fw-medium">test@test.com</div>
                                </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invite Dialog */}
              {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="bg-white dark:bg-[#171719] rounded-xl p-6 w-full max-w-md">
                    <h3 className="text-lg font-medium mb-4 text-black dark:text-white">Invite Member</h3>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full mb-4 px-4 py-2 border rounded-lg dark:bg-[#171719] dark:border-[#313131] dark:text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsDialogOpen(false)}
                        className="px-4 py-2 rounded-lg border border-white/10 hover:bg-gray-100 dark:hover:bg-[#171719]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleInvite}
                        className="px-4 py-2 rounded-lg bg-[#171719] text-white hover:bg-[#171719] border border-white/10"
                      >
                        Send Invite
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
